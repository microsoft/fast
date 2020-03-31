/* tslint:disable */
import { FastElement, observable, Observable } from "@microsoft/fast-element";
import { composedParent } from "../utilities";
import { DesignSystemResolverEntry } from "../styles/recipes";

/**
 * TODO: This should accept a config instead of a string:
 * interface conf { customPropertyName: string, customProperty: boolean }
 */
export function designSystemProperty(name: string): (source: any, target: string) => void;
export function designSystemProperty(source: any, target: string);
export function designSystemProperty(nameOrSource: any, target?: string) {
    const decorator = (source: any, property: string, name: string) => {
        if (!source.hasOwnProperty("designSystemProperties")) {
            source.designSystemProperties = [];
        }

        source.designSystemProperties.push({ property, name });
    };

    if (typeof nameOrSource === "string") {
        return (source: any, target: any) => {
            decorator(source, target, nameOrSource);
        };
    } else {
        decorator(nameOrSource, target!, target!);
    }
}

interface DesignSystemConsumer {
    recipes: DesignSystemResolverEntry[];
}

export class DesignSystemProvider extends FastElement {
    @observable
    public designSystem: any = {};

    private provider: DesignSystemProvider | null = null;

    private consumers: Set<DesignSystemConsumer> = new Set();

    /**
     * Track all design system property names so we can react to changes
     * in those properties. Do not initialize or it will clobber vlaues stored
     * by the decorator.
     */
    protected designSystemProperties: Array<{ property: string; name: string }>;

    public connectedCallback(): void {
        super.connectedCallback();
        const provider = this.findProvider();

        if (!!provider) {
            this.provider = provider;
            Observable.getNotifier(this.provider).subscribe(this, "designSystem");
        }

        this.designSystem = this.collectDesignSystem();

        const notifier = Observable.getNotifier(this);
        this.designSystemProperties.forEach(property => {
            notifier.subscribe(this, property.property);
        });

        // TODO: Refactor
        Object.entries(this.collectLocalDesignSystem()).forEach(entry => {
            const [property, value] = entry;
            const name = this.designSystemProperties.find(
                prop => prop.property === property
            )!.name;

            this.style.setProperty(`--${name}`, value);
        });
    }

    /**
     * Invoked when the parent provider's design-system object changes
     * or when any property defined as a design-system property is changed.
     * Will update the designSystem object
     * @param source The source object changing
     * @param key The property of the source object that changed
     */
    public handleChange(source, key) {
        this.designSystem = this.collectDesignSystem();
        this.writeRecipeData();

        if (source === this) {
            // TODO: Refactor
            Object.entries(this.collectLocalDesignSystem()).forEach(entry => {
                const [property, value] = entry;
                const name = this.designSystemProperties.find(
                    prop => prop.property === property
                )!.name;

                this.style.setProperty(`--${name}`, value);
            });
        }
    }

    /**
     * Find the parent DesignSystem provider.
     * TODO: We'll likely want to share this with the recipe consumer
     */
    public findProvider(): DesignSystemProvider | null {
        let parent = composedParent(this as any);

        while (parent !== null) {
            if (parent instanceof DesignSystemProvider) {
                return parent;
            } else {
                parent = composedParent(parent);
            }
        }

        return null;
    }

    /**
     * Pick all design-system properties of this instance
     * that are not null or undefined into an object
     */
    private collectLocalDesignSystem(): { [key: string]: any } {
        return this.designSystemProperties.reduce((prev, next) => {
            const value = this[next.property];
            if (value !== undefined && value !== null) {
                prev[next.property] = value;
            }

            return prev;
        }, {});
    }

    private collectDesignSystem() {
        return !!this.provider
            ? { ...this.provider.designSystem, ...this.collectLocalDesignSystem() }
            : this.collectLocalDesignSystem();
    }

    public suscribe(consumer: { recipes: DesignSystemResolverEntry[] }) {
        if (!this.consumers.has(consumer)) {
            this.consumers.add(consumer);
            console.log("consumer added", consumer);
            this.writeRecipeData();
        }
    }

    private writeRecipeData() {
        this.consumers.forEach(consumer => {
            consumer.recipes.forEach(recipe => {
                this.style.setProperty(
                    `--${recipe.name}`,
                    recipe.resolver(this.designSystem).toString()
                );
            });
        });
    }
}
