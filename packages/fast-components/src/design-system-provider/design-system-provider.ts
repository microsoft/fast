/* tslint:disable */
import { FastElement, observable, Observable } from "@microsoft/fast-element";
import { DesignSystemConsumer, designSystemConsumer } from "./design-system-consumer";
/**
 * TODO: This should accept a config instead of a string:
 * interface conf { customPropertyName: string, customProperty: boolean }
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

interface CustomPropertyDefinition {
    name: string;
    value: string | (() => string);
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
     */
    public readonly isDesignSystemProvider = true;

    @observable
    public customProperties: CustomPropertyDefinition[] = [];

    public designSystem: any = mutationObserver(this, "designSystem");

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
    public handleChange(source, key) {
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
        }
    }

    public suscribe(consumer: DesignSystemConsumer) {
        if (!this.consumers.has(consumer)) {
            this.consumers.add(consumer);
            this.writeConsumerRecipeData(consumer);
        }
    }

    private writeConsumerRecipeData(consumer: DesignSystemConsumer) {
        consumer.recipes.forEach(recipe => {
            this.setCustomProperty({
                name: recipe.name,
                value: recipe.resolver.bind(this, this.designSystem),
            });
        });
    }

    private providerChanged() {
        console.log("provider changed", this.provider);
    }
}
