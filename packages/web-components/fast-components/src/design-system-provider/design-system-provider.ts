import { DOM, FastElement, Observable, observable } from "@microsoft/fast-element";
import { DesignSystemConsumer, designSystemConsumer } from "../design-system-consumer";

interface DesignSystemPropertyDeclarationConfig {
    customPropertyName?: string;
    customProperty?: boolean;
}

interface SetCustomPropertyConfig {
    customPropertyName: string;
    value: string | (() => string);
}

interface DeleteCustomPropertyConfig {
    customPropertyName: string;
}

/**
 * Decorator to declare a property as a design-system property.
 * Accepts an optional config to customize whether a css custom property
 * will be written and if so, what the name of that property is.
 */
export function designSystemProperty<T extends DesignSystemProvider>(
    config: DesignSystemPropertyDeclarationConfig
): (source: T, property: string) => void;
export function designSystemProperty<T extends DesignSystemProvider>(
    source: T,
    property: string
): void;
export function designSystemProperty<T extends DesignSystemProvider>(
    configOrSource: T | DesignSystemPropertyDeclarationConfig,
    property?: string
): any {
    const decorator = (
        source: T,
        prop: string,
        config: DesignSystemPropertyDeclarationConfig = {}
    ) => {
        if (!source.designSystemProperties) {
            source.designSystemProperties = {};
        }

        source.designSystemProperties[prop] = {
            customPropertyName: config.customPropertyName || prop,
            customProperty:
                typeof config.customProperty === "boolean" ? config.customProperty : true,
        };
    };

    if (arguments.length > 1) {
        // Invoked with no options
        decorator(configOrSource as T, property!);
    } else {
        return (source: T, prop: string) => {
            decorator(
                source,
                prop,
                configOrSource as DesignSystemPropertyDeclarationConfig
            );
        };
    }
}

/**
 * Type-safe checking for if an HTMLElement is a DesignSystemProvider.
 * @param el The element to test
 */
export function isDesignSystemProvider(
    el: HTMLElement | DesignSystemProvider
): el is DesignSystemProvider {
    return (el as any).isDesignSystemProvider;
}

/**
 * Slight hack to get intelisense and type checking for the
 * @designSystemConsumer decorator because TypeScript does
 * not allow type mutation for decorators.
 * https://github.com/microsoft/TypeScript/issues/4881
 */
/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface DesignSystemProvider extends DesignSystemConsumer {}
@designSystemConsumer
export class DesignSystemProvider extends FastElement {
    /**
     * Allows other components to identify this as a provider.
     * Using instanceof DesignSystemProvider did not seem to work.
     */
    public readonly isDesignSystemProvider = true;

    /**
     * RAF-throttled method to set css custom properties on the instance
     */
    private customPropertyManager = new CustomPropertyManager(this);

    /**
     * The design-system object.
     * This is "observable" but will notify on object mutation
     * instead of object assignment
     */
    public designSystem = {};

    /**
     * All consumer objects registered with the provider.
     */
    private consumers: Set<DesignSystemConsumer> = new Set();

    /**
     * Track all design system property names so we can react to changes
     * in those properties. Do not initialize or it will clobber value stored
     * by the decorator.
     */
    public designSystemProperties: {
        [propertyName: string]: Required<DesignSystemPropertyDeclarationConfig>;
    };

    public connectedCallback(): void {
        super.connectedCallback();
        const selfNotifier = Observable.getNotifier(this);
        const designSystemNotifier = Observable.getNotifier(this.designSystem);

        Object.keys(this.designSystemProperties).forEach(property => {
            observable(this.designSystem, property);

            selfNotifier.subscribe(this.attributeChangeHandler, property); // Notify ourselves when properties related to DS change
            designSystemNotifier.subscribe(this.localDesignSystemChangeHandler, property); // Notify ourselves when design system properties change

            const value = this[property];

            // If property is set then put it onto the design system
            if (this.isValidDesignSystemValue(value)) {
                this.designSystem[property] = value;
                this.customPropertyManager.set({
                    ...this.designSystemProperties[property],
                    value,
                });
            }
        });
    }

    private attributeChangeHandler = {
        handleChange: (source: this, key: string) => {
            const value = this[key];

            if (this.isValidDesignSystemValue(value)) {
                this.designSystem[key] = value;
                const property = this.designSystemProperties[key];

                if (property && property.customProperty) {
                    this.customPropertyManager.set({
                        customPropertyName: property.customPropertyName,
                        value,
                    });
                }
            } else {
                this.syncDesignSystemWithProvider();
                this.customPropertyManager.delete(this.designSystemProperties[key]);
                this.writeRecipeData();
            }
        },
    };

    private localDesignSystemChangeHandler = {
        handleChange: this.writeRecipeData.bind(this),
    };

    private providerDesignSystemChangeHandler = {
        handleChange: (source: any, key: string) => {
            if (
                source[key] !== this.designSystem[key] &&
                !this.isValidDesignSystemValue(this[key])
            ) {
                this.designSystem[key] = source[key];
            }
        },
    };

    public subscribe(consumer: DesignSystemConsumer): void {
        if (!this.consumers.has(consumer)) {
            this.consumers.add(consumer);
            this.writeConsumerRecipeData(consumer);
        }
    }

    public unsubscribe(consumer: DesignSystemConsumer): void {
        this.consumers.delete(consumer);
    }

    private writeRecipeData(): void {
        this.consumers.forEach(this.writeConsumerRecipeData);
    }

    private writeConsumerRecipeData = (consumer: DesignSystemConsumer) => {
        consumer.recipes.forEach(recipe => {
            this.customPropertyManager.set({
                customPropertyName: recipe.name,
                // use spread on the designSystem object to circumvent memoization
                // done in the color recipes - we use the same *reference* in WC
                // for performance improvements but that throws off the recipes
                // We should look at making the recipes use simple args that
                // we can individually memoize.
                value: recipe.resolver.bind(this, { ...this.designSystem }),
            });
        });
    };

    /**
     * Synchronize the provider's design system with the local
     * overrides. Any value defined on the instance will take priority
     * over the value defined by the provider
     */
    private syncDesignSystemWithProvider(): void {
        if (this.provider) {
            Object.entries(this.designSystemProperties).forEach(entry => {
                if (!this.isValidDesignSystemValue(entry[1])) {
                    this.designSystem[entry[0]] = this.provider!.designSystem[entry[0]];
                }
            });
        }
    }

    private isValidDesignSystemValue(value: any): boolean {
        return value !== void 0 && value !== null;
    }

    /**
     * Invoked when the provider observable property defined by the consumer is changed
     * @param prev the previous value
     * @param next the next value
     */
    private providerChanged(
        prev: DesignSystemProvider | null,
        next: DesignSystemProvider | null
    ): void {
        if (prev instanceof HTMLElement) {
            Object.keys(prev.designSystemProperties).forEach(key => {
                Observable.getNotifier(prev.designSystem).unsubscribe(
                    this.providerDesignSystemChangeHandler,
                    key
                );
            });
        }

        if (next instanceof HTMLElement && isDesignSystemProvider(next)) {
            Object.keys(next.designSystemProperties).forEach(key => {
                Observable.getNotifier(next.designSystem).subscribe(
                    this.providerDesignSystemChangeHandler,
                    key
                );
            });

            this.syncDesignSystemWithProvider();
        }
    }
}

class CustomPropertyManager<
    T extends {
        style: {
            setProperty(name: string, value: any): void;
            removeProperty(name: string): void;
        };
    }
> {
    private ticking = false;
    private store: Array<SetCustomPropertyConfig | DeleteCustomPropertyConfig> = [];
    constructor(private context: T) {}

    private shouldSet(
        config: SetCustomPropertyConfig | DeleteCustomPropertyConfig
    ): config is SetCustomPropertyConfig {
        return config.hasOwnProperty("value");
    }

    private tick = (): void => {
        this.ticking = false;

        for (let i = 0; i < this.store.length; i++) {
            const config = this.store[i];
            const name = `--${config.customPropertyName}`;

            if (this.shouldSet(config)) {
                this.context.style.setProperty(
                    name,
                    typeof config.value === "function" ? config.value() : config.value
                );
            } else {
                this.context.style.removeProperty(name);
            }
        }

        this.store = [];
    };

    private append(
        definition: SetCustomPropertyConfig | DeleteCustomPropertyConfig
    ): void {
        const index = this.store.findIndex(
            x => x.customPropertyName === definition.customPropertyName
        );

        if (index !== -1) {
            this.store[index] = definition;
        } else {
            this.store.push(definition);
        }

        if (this.ticking) {
            return;
        } else {
            this.ticking = true;
            DOM.queueUpdate(this.tick);
        }
    }

    public set: (config: SetCustomPropertyConfig) => void = this.append;
    public delete: (config: DeleteCustomPropertyConfig) => void = this.append;
}
