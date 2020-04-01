/* tslint:disable */
import { FastElement, observable, Observable } from "@microsoft/fast-element";
import { DesignSystemConsumer, designSystemConsumer } from "./design-system-consumer";

interface CustomPropertyDefinition {
    name: string;
    value: string | (() => string);
}

/**
 * Decorator to declare a property as a design-system property.
 * Accepts an optional config to customize whether a css custom property
 * wll be written and if so, what the name of that property is
 */
export function designSystemProperty(config: {
    customPropertyName?: string;
    customProperty?: boolean;
}): (source: any, target: string) => void;
export function designSystemProperty(source: any, target: string);
export function designSystemProperty(nameOrSource: any, target?: string) {
    const decorator = (
        source: any,
        property: string,
        customPropertyName: string,
        customProperty: boolean
    ) => {
        if (!source.hasOwnProperty("designSystemProperties")) {
            source.designSystemProperties = [];
        }

        source.designSystemProperties.push({
            property,
            customPropertyName,
            customProperty,
        });
    };

    if (arguments.length > 1) {
        // Invoked with no options
        decorator(nameOrSource, target!, target!, true);
    } else {
        return (source: any, target: any) => {
            const { customPropertyName, customProperty } = nameOrSource;
            decorator(
                source,
                target,
                customPropertyName || target,
                customProperty === void 0 ? true : customProperty
            );
        };
    }
}

/**
 * Simple proxy object to notifiy observers on
 * object mutation.
 * @param source The object to fire notifications
 */
function mutationObserver(source, key) {
    const notifier = Observable.getNotifier(source);

    return new Proxy(
        {},
        {
            set: function(obj, prop, value) {
                obj[prop] = value;

                notifier.notify(source, key);
                return true;
            },
        }
    );
}

function setCustomPropertyFactory(source: any) {
    let store: CustomPropertyDefinition[] = [];
    let ticking = false;

    return (operation: CustomPropertyDefinition) => {
        const index = store.findIndex(x => x.name === operation.name);

        if (index !== -1) {
            store[index] = operation;
        } else {
            store.push(operation);
        }

        if (ticking) {
            return;
        } else {
            ticking = true;

            window.requestAnimationFrame(() => {
                ticking = false;

                for (var i = 0; i < store.length; i++) {
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
export interface DesignSystemProvider extends DesignSystemConsumer {}
@designSystemConsumer
export class DesignSystemProvider extends FastElement {
    private setCustomProperty = setCustomPropertyFactory(this);

    /**
     * Allows other components to identify this as a provider.
     * Using instanceof DesignSystemProvider did not seem to work.
     */
    public readonly isDesignSystemProvider = true;

    @observable
    public customProperties: CustomPropertyDefinition[] = [];

    public designSystem = mutationObserver(this, "designSystem");

    private consumers: Set<DesignSystemConsumer> = new Set();

    /**
     * Track all design system property names so we can react to changes
     * in those properties. Do not initialize or it will clobber value stored
     * by the decorator.
     */
    protected designSystemProperties: Array<{
        property: string;
        customPropertyName: string;
        customProperty: boolean;
    }>;

    public connectedCallback(): void {
        super.connectedCallback();
        const notifier = Observable.getNotifier(this);

        this.designSystemProperties.forEach(property => {
            notifier.subscribe(this, property.property);
        });

        notifier.subscribe(this, "designSystem");
    }

    /**
     * Invoked when the parent provider's design-system object changes
     * or when any property defined as a design-system property is changed.
     * Will update the designSystem object
     * @param source The source object changing
     * @param key The property of the source object that changed
     */
    public handleChange(source: any, key: string) {
        if (
            source === this &&
            this.designSystemProperties.some(value => value.property === key)
        ) {
            this.designSystem[key] = this[key];
            const desginSystemProperty = this.designSystemProperties.find(
                x => x.property === key
            );

            if (desginSystemProperty && desginSystemProperty.customProperty) {
                this.setCustomProperty({
                    name: desginSystemProperty.customPropertyName,
                    value: this[desginSystemProperty.property],
                });
            }
        } else if (source !== this && key === "designSystem") {
            this.syncDesignSystemWithProvider();
        }

        this.consumers.forEach(this.writeConsumerRecipeData);
    }

    public suscribe(consumer: DesignSystemConsumer) {
        if (!this.consumers.has(consumer)) {
            this.consumers.add(consumer);
            this.writeConsumerRecipeData(consumer);
        }
    }

    private writeConsumerRecipeData = (consumer: DesignSystemConsumer) => {
        consumer.recipes.forEach(recipe => {
            this.setCustomProperty({
                name: recipe.name,
                // use spread on the designSystem object to circumvent memoization
                // done in the color recipes - we use the same *reference* in WC
                // for performance improvements but that throws off the recipes
                // We should look at making the recipes require preset args
                value: recipe.resolver.bind(this, { ...this.designSystem }),
            });
        });
    };

    /**
     * Syncronizes the provider's design system with the local
     * overrides. Any value defined on the instance will take precidences
     * over the value defined by the provider
     */
    private syncDesignSystemWithProvider() {
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
    ) {
        if (prev instanceof HTMLElement) {
            Observable.getNotifier(prev).unsubscribe(this, "designSystem");
        }

        if (next instanceof HTMLElement && isDesignSystemProvider(next)) {
            Observable.getNotifier(next).subscribe(this, "designSystem");
            this.syncDesignSystemWithProvider();
        }
    }
}
