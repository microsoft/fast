import { FASTElement, Observable, observable } from "@microsoft/fast-element";
import {
    DesignSystemConsumer,
    DesignSystemConsumerBehavior,
} from "../design-system-consumer";
import {
    CSSCustomPropertyDefinition,
    CSSCustomPropertyTarget,
} from "../custom-properties";
import { isDesignSystemProvider } from "./is-design-system-provider";

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

const supportsAdoptedStylesheets = "adoptedStyleSheets" in window.ShadowRoot.prototype;

export class DesignSystemProvider extends FASTElement
    implements CSSCustomPropertyTarget, DesignSystemConsumer {
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

    /**
     * Stores all CSSCustomPropertyDefinitions registered with the provider.
     */
    private cssCustomPropertyDefinitions: Map<
        string,
        CSSCustomPropertyDefinition & { count: number }
    > = new Map();

    /**
     * Track all design system property names so we can react to changes
     * in those properties. Do not initialize or it will clobber value stored
     * by the decorator.
     */
    public designSystemProperties: {
        [propertyName: string]: Required<DesignSystemPropertyDeclarationConfig>;
    };

    /**
     * Allows CSSCustomPropertyDefinitions to register on this element *before* the constructor
     * has run and the registration APIs exist. This can manifest when the DOM
     * is parsed (and custom element tags exist in the DOM) before the script defining the custom elements
     * and elements is parsed, and the elements using the CSSCustomPropertyBehaviors
     * are defined before this DesignSystemProvider.
     */
    public disconnectedCSSCustomPropertyRegistry: CSSCustomPropertyDefinition[];

    /**
     * The target of CSSCustomPropertyDefinitions registered
     * with the provider. This will be #1 when adoptedStyleSheets are supported
     * and #2 when they are not.
     *
     * 1. The `style` property of a CSSStyleRule on an adoptedStyleSheet
     * 2. The `style` property of the element, resulting in inline styles
     */
    private customPropertyTarget: CSSStyleDeclaration;

    /**
     * Handle changes to design-system-provider IDL and content attributes
     * that reflect to design-system properties.
     */
    private attributeChangeHandler = {
        handleChange: (source: this, key: string) => {
            const value = this[key];

            if (this.isValidDesignSystemValue(value)) {
                this.designSystem[key] = value;
                const property = this.designSystemProperties[key];

                if (property && property.customProperty) {
                    this.setCustomProperty({
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

    /**
     * Handle changes to the local design-system property.
     */
    private localDesignSystemChangeHandler = {
        handleChange: this.writeCustomProperties.bind(this),
    };

    /**
     * Handle changes to the upstream design-system provider
     */
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

    constructor() {
        super();

        if (supportsAdoptedStylesheets && this.shadowRoot !== null) {
            const sheet = new CSSStyleSheet();
            sheet.insertRule(":host{}");
            (this.shadowRoot as any).adoptedStyleSheets = [
                ...(this.shadowRoot as any).adoptedStyleSheets,
                sheet,
            ];

            this.customPropertyTarget = (sheet.rules[0] as CSSStyleRule).style;
        } else {
            this.customPropertyTarget = this.style;
        }

        this.$fastController.addBehaviors([new DesignSystemConsumerBehavior()]);
    }

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
                this.setCustomProperty({
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
     * Register a CSSCustomPropertyDefinition with the design system provider.
     * Registering a CSSCustomPropertyDefinition will create the CSS custom property.
     */
    public registerCSSCustomProperty(behavior: CSSCustomPropertyDefinition) {
        const cached = this.cssCustomPropertyDefinitions.get(behavior.name);

        if (cached) {
            cached.count += 1;
        } else {
            this.cssCustomPropertyDefinitions.set(behavior.name, {
                ...behavior,
                count: 1,
            });
            this.setCustomProperty(behavior);
        }
    }

    /**
     * Unregister a CSSCustomPropertyDefinition. If all registrations of the definition
     * are unregistered, the CSS custom property will be removed.
     */
    public unregisterCSSCustomProperty(behavior: CSSCustomPropertyDefinition) {
        const cached = this.cssCustomPropertyDefinitions.get(behavior.name);

        if (cached) {
            cached.count -= 1;

            if (cached.count === 0) {
                this.cssCustomPropertyDefinitions.delete(behavior.name);
                this.deleteCustomProperty(behavior.name);
            }
        }
    }

    /**
     * Writes all CSS custom property definitions to the design system provider.
     */
    private writeCustomProperties(): void {
        this.cssCustomPropertyDefinitions.forEach(this.setCustomProperty);
    }

    /**
     * Writes a CSS custom property to the design system provider,
     * evaluating any function values with the design system.
     */
    private setCustomProperty = (definition: CSSCustomPropertyDefinition) => {
        this.customPropertyTarget.setProperty(
            `--${definition.name}`,
            this.evaluate(definition)
        );
    };

    /**
     * Removes a CSS custom property from the provider.
     */
    private deleteCustomProperty = (name: string): void => {
        this.customPropertyTarget.removeProperty(`--${name}`);
    };

    /**
     * Evaluates a CSSCustomPropertyDefinition with the current design system.
     */
    public evaluate(definition: CSSCustomPropertyDefinition): string {
        return typeof definition.value === "function"
            ? // use spread on the designSystem object to circumvent memoization
              // done in the color recipes - we use the same *reference* in WC
              // for performance improvements but that throws off the recipes
              // We should look at making the recipes use simple args that
              // we can individually memoize.
              definition.value({ ...this.designSystem })
            : definition.value;
    }
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
