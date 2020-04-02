import { FastElement, Observable } from "@microsoft/fast-element";
import { DesignSystemConsumer, designSystemConsumer } from "../design-system-consumer";

interface CustomPropertyDefinition {
    name: string;
    value: string | (() => string);
}

interface DesignSystemPropertyDeclarationConfig {
    customPropertyName?: string;
    customProperty?: boolean;
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

const designSystemKey = "designSystem";

/**
 * Slight hack to get intelisense and type checking for the
 * @designSystemConsumer decorator because TypeScript does
 * not allow type mutation for decorators.
 * https://github.com/microsoft/TypeScript/issues/4881
 */
/* tslint:disable-next-line */
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
    private setCustomProperty = setCustomPropertyFactory(this);

    /**
     * The design-system object.
     * This is "obvservable" but will notify on object mutation
     * instead of object assignment
     */
    public designSystem = mutationObserver(this, designSystemKey);

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
        const notifier = Observable.getNotifier(this);

        Object.keys(this.designSystemProperties).forEach(property => {
            notifier.subscribe(this, property);
        });

        notifier.subscribe(this, designSystemKey);
    }

    /**
     * Invoked when the parent provider's design-system object changes
     * or when any property defined as a design-system property is changed.
     * Will update the designSystem object
     * @param source The source object changing
     * @param key The property of the source object that changed
     */
    public handleChange(source: any, key: string): void {
        if (source === this && this.designSystemProperties.hasOwnProperty(key)) {
            // If a property on *this* object that is declared as a design system property
            this.designSystem[key] = this[key];
            const desginSystemProperty = this.designSystemProperties[key];

            if (desginSystemProperty && desginSystemProperty.customProperty) {
                this.setCustomProperty({
                    name: desginSystemProperty.customPropertyName,
                    value: this[key],
                });
            }
            this.consumers.forEach(this.writeConsumerRecipeData);
        } else if (source === this.provider && key === designSystemKey) {
            // If our provider's design system has changed
            this.syncDesignSystemWithProvider();
            this.consumers.forEach(this.writeConsumerRecipeData);
        }
    }

    public suscribe(consumer: DesignSystemConsumer): void {
        if (!this.consumers.has(consumer)) {
            this.consumers.add(consumer);
            this.writeConsumerRecipeData(consumer);
        }
    }

    public unsubscribe(consumer: DesignSystemConsumer): void {
        this.consumers.delete(consumer);
    }

    private writeConsumerRecipeData = (consumer: DesignSystemConsumer) => {
        consumer.recipes.forEach(recipe => {
            this.setCustomProperty({
                name: recipe.name,
                // use spread on the designSystem object to circumvent memoization
                // done in the color recipes - we use the same *reference* in WC
                // for performance improvements but that throws off the recipes
                // We should look at making the recipes use simple args that
                // we can individuall memoize.
                value: recipe.resolver.bind(this, { ...this.designSystem }),
            });
        });
    };

    /**
     * Syncronizes the provider's design system with the local
     * overrides. Any value defined on the instance will take priority
     * over the value defined by the provider
     */
    private syncDesignSystemWithProvider(): void {
        if (this.provider) {
            Object.keys(this.provider.designSystem).forEach(key => {
                if (this[key] === void 0) {
                    this.designSystem[key] = this.provider!.designSystem[key];
                }
            });
        }
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
            Observable.getNotifier(prev).unsubscribe(this, designSystemKey);
        }

        if (next instanceof HTMLElement && isDesignSystemProvider(next)) {
            Observable.getNotifier(next).subscribe(this, designSystemKey);
            this.syncDesignSystemWithProvider();
        }
    }
}

/**
 * Simple proxy object to notifiy observers on
 * object mutation.
 * @param source The object to fire notifications
 * @param key The observable property name to fire a notification on
 */
function mutationObserver(source: any, key: string): {} {
    const notifier = Observable.getNotifier(source);

    return new Proxy(
        {},
        {
            set(obj: any, prop: string, value: any): boolean {
                obj[prop] = value;

                notifier.notify(source, key);
                return true;
            },
        }
    );
}

function setCustomPropertyFactory(
    source: any
): (definition: CustomPropertyDefinition) => void {
    let store: CustomPropertyDefinition[] = [];
    let ticking = false;

    return (definition: CustomPropertyDefinition) => {
        const index = store.findIndex(x => x.name === definition.name);

        if (index !== -1) {
            store[index] = definition;
        } else {
            store.push(definition);
        }

        if (ticking) {
            return;
        } else {
            ticking = true;

            window.requestAnimationFrame(() => {
                ticking = false;

                /* tslint:disable-next-line */
                for (let i = 0; i < store.length; i++) {
                    const value = store[i];

                    source.style.setProperty(
                        `--${value.name}`,
                        typeof value.value === "function" ? value.value() : value.value
                    );
                }

                store = [];
            });
        }
    };
}
