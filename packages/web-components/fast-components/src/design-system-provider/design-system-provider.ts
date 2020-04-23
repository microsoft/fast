import { FASTElement, Observable, observable } from "@microsoft/fast-element";
import {
    DesignSystemConsumer,
    DesignSystemConsumerBehavior,
} from "../design-system-consumer";
import {
    CSSCustomPropertyDefinition,
    CSSCustomPropertyTarget,
} from "../custom-properties";

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
    return (
        (el as any).isDesignSystemProvider || el.tagName === "FAST-DESIGN-SYSTEM-PROVIDER"
    );
}

const customPropertyNameCache: { [key: string]: string } = {};
function formatCustomPropertyName(name: string): string {
    if (customPropertyNameCache[name] !== undefined) {
        return customPropertyNameCache[name];
    } else {
        return (customPropertyNameCache[name] = `--${name}`);
    }
}

function writeCSSCustomPropertyDefinitionInline(
    this: DesignSystemProvider,
    definition: CSSCustomPropertyDefinition
) {
    const name = formatCustomPropertyName(definition.name);
    const value =
        typeof definition.value === "function"
            ? // use spread on the designSystem object to circumvent memoization
              // done in the color recipes - we use the same *reference* in WC
              // for performance improvements but that throws off the recipes
              // We should look at making the recipes use simple args that
              // we can individually memoize.
              definition.value({ ...this.designSystem })
            : definition.value;

    if (this.style.getPropertyValue(name) !== value) {
        this.style.setProperty(name, value);
    }
}

function deleteCSSCustomPropertyDefinitionInline(
    this: DesignSystemProvider,
    definition: CSSCustomPropertyDefinition
) {
    this.style.removeProperty(formatCustomPropertyName(definition.name));
}

/**
 * Scope of change:
 * This change changes the behavior of the design-system-provider to synchronously create
 * css custom properties instead of batch the update. This is being done to prevent flashes
 * of un-styled content and un-desired transitions that result from the property not being
 * defined when the sheet is initially rendered.
 *
 * This change also introduces an optimization where it will use adopted stylesheets to create
 * the custom properties when that API is available. There are significant performance benefits
 * to this approach: https://jsbench.me/hck9d4noez/1. Inline styles will be the fallback behavior
 * if adopted stylesheets are not supported.
 */

const supportsAdoptedStylesheets = "adoptedStyleSheets" in window.ShadowRoot.prototype;

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
                this.deleteCustomProperty(behavior.name);
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

        if (supportsAdoptedStylesheets) {
            this.writeCustomProperty = () => console.log("Write some custom properties");
            this.deleteCustomProperty = () =>
                console.log("Delete some custom properties");
        } else {
            this.writeCustomProperty = writeCSSCustomPropertyDefinitionInline.bind(this);
            this.deleteCustomProperty = deleteCSSCustomPropertyDefinitionInline.bind(
                this
            );
        }

        this.$fastController.addBehaviors([new DesignSystemConsumerBehavior()]);
    }
    /**
     * Allows other components to identify this as a provider.
     * Using instanceof DesignSystemProvider did not seem to work.
     */
    public readonly isDesignSystemProvider = true;

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
                this.writeCustomProperty({
                    name: this.designSystemProperties[property].customPropertyName,
                    value,
                });
            }
        });

        // Register all properties that may have been attached before construction
        if (Array.isArray(this.disconnectedCSSCustomPropertyRegistry)) {
            for (let i = 0; i < this.disconnectedCSSCustomPropertyRegistry.length; i++) {
                this.registerCSSCustomProperty(
                    this.disconnectedCSSCustomPropertyRegistry[i]
                );
            }

            delete this.disconnectedCSSCustomPropertyRegistry;
        }
    }

    /**
     * Allows CSSCustomPropertyDefinitions to register on this element *before* the constructor
     * has run and the registration APIs exist. This can manifest when the DOM
     * is parsed (and custom element tags exist in the DOM) before the script defining the custom elements
     * and elements is parsed, and the elements using the CSSCustomPropertyBehaviors
     * are defined before this DesignSystemProvider.
     */
    public disconnectedCSSCustomPropertyRegistry: CSSCustomPropertyDefinition[];

    private attributeChangeHandler = {
        handleChange: (source: this, key: string) => {
            const value = this[key];

            if (this.isValidDesignSystemValue(value)) {
                this.designSystem[key] = value;
                const property = this.designSystemProperties[key];

                if (property && property.customProperty) {
                    this.writeCustomProperty({
                        name: property.customPropertyName,
                        value,
                    });
                }
            } else {
                this.syncDesignSystemWithProvider();
                this.deleteCustomProperty(
                    this.designSystemProperties[key].customPropertyName
                );
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

    private writeCustomProperty: (definition: CSSCustomPropertyDefinition) => void;
    private deleteCustomProperty: (name: string) => void;

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
