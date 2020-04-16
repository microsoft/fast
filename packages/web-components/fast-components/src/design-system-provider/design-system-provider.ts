import { FASTElement, Observable, observable } from "@microsoft/fast-element";
import {
    DesignSystemConsumer,
    DesignSystemConsumerBehavior,
} from "../design-system-consumer";
import {
    CSSCustomPropertyDefinition,
    CSSCustomPropertyTarget,
} from "../custom-properties";
import { CSSCustomPropertyManager } from "../custom-properties";

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

export class DesignSystemProvider extends FASTElement
    implements CSSCustomPropertyTarget, DesignSystemConsumer {
    private customPropertyBehaviors: Map<
        string,
        CSSCustomPropertyDefinition & { count: number }
    > = new Map();

    public registerCSSCustomProperty(behavior: CSSCustomPropertyDefinition) {
        const cached = this.customPropertyBehaviors.get(behavior.name);

        if (cached) {
            cached.count += 1;
        } else {
            this.customPropertyBehaviors.set(behavior.name, { ...behavior, count: 1 });
            this.writeCustomProperty(behavior);
        }
    }

    public unregisterCSSCustomProperty(behavior: CSSCustomPropertyDefinition) {
        const cached = this.customPropertyBehaviors.get(behavior.name);

        if (cached) {
            cached.count -= 1;

            if (cached.count === 0) {
                this.customPropertyBehaviors.delete(behavior.name);
                this.customPropertyManager.delete(behavior);
            }
        }
    }

    @observable
    public provider: DesignSystemProvider | null = null;
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

    constructor() {
        super();

        this.$fastController.addBehaviors([new DesignSystemConsumerBehavior()]);
    }
    /**
     * Allows other components to identify this as a provider.
     * Using instanceof DesignSystemProvider did not seem to work.
     */
    public readonly isDesignSystemProvider = true;

    /**
     * RAF-throttled method to set css custom properties on the instance
     */
    private customPropertyManager = new CSSCustomPropertyManager(this);

    /**
     * The design-system object.
     * This is "observable" but will notify on object mutation
     * instead of object assignment
     */
    public designSystem = {};

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
                    name: this.designSystemProperties[property].customPropertyName,
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
                        name: property.customPropertyName,
                        value,
                    });
                }
            } else {
                this.syncDesignSystemWithProvider();
                this.customPropertyManager.delete({
                    name: this.designSystemProperties[key].customPropertyName,
                });
                this.writeCustomProperties();
            }
        },
    };

    private localDesignSystemChangeHandler = {
        handleChange: this.writeCustomProperties.bind(this),
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

    private writeCustomProperties(): void {
        this.customPropertyBehaviors.forEach(this.writeCustomProperty);
    }

    private writeCustomProperty = (definition: CSSCustomPropertyDefinition) => {
        this.customPropertyManager.set({
            name: definition.name,
            value:
                typeof definition.value === "function"
                    ? // use spread on the designSystem object to circumvent memoization
                      // done in the color recipes - we use the same *reference* in WC
                      // for performance improvements but that throws off the recipes
                      // We should look at making the recipes use simple args that
                      // we can individually memoize.
                      definition.value.bind(this, { ...this.designSystem })
                    : definition.value,
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
}
