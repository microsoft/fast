import {
    attr,
    Behavior,
    customElement,
    FASTElement,
    observable,
    Observable,
} from "@microsoft/fast-element";
import { PartialFASTElementDefinition } from "@microsoft/fast-element";
import {
    CSSCustomPropertyDefinition,
    CSSCustomPropertyTarget,
} from "../custom-properties/index";
import { composedParent } from "../utilities/composed-parent";
import { DecoratorDesignSystemPropertyConfiguration } from "./design-system-property";

const supportsAdoptedStylesheets = "adoptedStyleSheets" in window.ShadowRoot.prototype;

/**
 * Defines a structure that consumes from a DesignSystemProvider
 * @public
 */
export interface DesignSystemConsumer {
    provider: DesignSystemProvider | null;
}

/**
 * Determines if the element is {@link DesignSystemConsumer}
 * @param element - the element to test.
 * @public
 */
export function isDesignSystemConsumer(
    element: HTMLElement | DesignSystemConsumer
): element is DesignSystemConsumer {
    const provider: DesignSystemProvider | null | void = (element as any).provider;

    return (
        provider !== null &&
        provider !== void 0 &&
        DesignSystemProvider.isDesignSystemProvider(provider)
    );
}

/**
 * Behavior to connect a {@link DesignSystemConsumer} to the nearest {@link DesignSystemProvider}
 * @public
 */
export const designSystemConsumerBehavior: Behavior = {
    bind<T extends DesignSystemConsumer & HTMLElement>(source: T) {
        source.provider = DesignSystemProvider.findProvider(source);
    },

    /* eslint-disable-next-line */
    unbind<T extends DesignSystemConsumer & HTMLElement>(source: T) {},
};

/**
 * A element to provide Design System values to consumers via CSS custom properties
 * and to resolve recipe values.
 *
 * @public
 */
export class DesignSystemProvider extends FASTElement
    implements CSSCustomPropertyTarget, DesignSystemConsumer {
    /**
     * Stores a list of all element tag-names that associated
     * to design-system-providers
     */
    private static _tagNames: string[] = [];

    /**
     * Read all tag-names that are associated to
     * design-system-providers
     *
     * @public
     */
    public static get tagNames() {
        return DesignSystemProvider._tagNames;
    }

    /**
     * Determines if an element is a DesignSystemProvider
     * @param el - The element to test
     *
     * @public
     */
    public static isDesignSystemProvider(
        el: HTMLElement | DesignSystemProvider
    ): el is DesignSystemProvider {
        return (
            (el as DesignSystemProvider).isDesignSystemProvider ||
            DesignSystemProvider.tagNames.indexOf(el.tagName) !== -1
        );
    }

    /**
     * Finds the closest design-system-provider
     * to an element.
     *
     * @param el - The element from which to begin searching.
     * @public
     */
    public static findProvider(
        el: HTMLElement & Partial<DesignSystemConsumer>
    ): DesignSystemProvider | null {
        if (isDesignSystemConsumer(el)) {
            return el.provider;
        }

        let parent = composedParent(el);

        while (parent !== null) {
            if (DesignSystemProvider.isDesignSystemProvider(parent)) {
                el.provider = parent; // Store provider on ourselves for future reference
                return parent;
            } else if (isDesignSystemConsumer(parent)) {
                el.provider = parent.provider;
                return parent.provider;
            } else {
                parent = composedParent(parent);
            }
        }

        return null;
    }

    /**
     * Registers a tag-name to be associated with
     * the design-system-provider class. All tag-names for DesignSystemProvider elements
     * must be registered for proper property resolution.
     *
     * @param tagName - the HTML Element tag name to register as a DesignSystemProvider.
     *
     * @public
     */
    public static registerTagName(tagName: string) {
        const tagNameUpper = tagName.toUpperCase();
        if (DesignSystemProvider.tagNames.indexOf(tagNameUpper) === -1) {
            DesignSystemProvider._tagNames.push(tagNameUpper);
        }
    }

    /**
     * Allows other components to identify this as a provider.
     * Using instanceof DesignSystemProvider did not seem to work.
     *
     * @public
     */
    public readonly isDesignSystemProvider = true;

    /**
     * The design-system object.
     * This is "observable" but will notify on object mutation
     * instead of object assignment
     *
     * @public
     */
    public designSystem = {};

    /**
     * Applies the default design-system values to the instance where properties
     * are not explicitly assigned. This is generally used to set the root design
     * system context.
     *
     * @public
     * @remarks
     * HTML Attribute: use-defaults
     */
    @attr({ attribute: "use-defaults", mode: "boolean" })
    public useDefaults: boolean = false;
    private useDefaultsChanged() {
        if (this.useDefaults) {
            const props = this.designSystemProperties;
            Object.keys(props).forEach((key: string) => {
                if (this[key] === void 0) {
                    this[key] = props[key].default;
                }
            });
        }
    }

    /**
     * The parent provider the the DesignSystemProvider instance.
     * @public
     */
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

        if (
            next instanceof HTMLElement &&
            DesignSystemProvider.isDesignSystemProvider(next)
        ) {
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
     *
     * @internal
     */
    public designSystemProperties: {
        [propertyName: string]: Required<
            Pick<
                DecoratorDesignSystemPropertyConfiguration,
                "cssCustomProperty" | "default"
            >
        >;
    };

    /**
     * Allows CSSCustomPropertyDefinitions to register on this element *before* the constructor
     * has run and the registration APIs exist. This can manifest when the DOM
     * is parsed (and custom element tags exist in the DOM) before the script defining the custom elements
     * is parsed, and when the elements using the CSSCustomPropertyBehaviors
     * are defined before this DesignSystemProvider.
     *
     * @public
     * @deprecated - use disconnectedRegistry
     */
    public disconnectedCSSCustomPropertyRegistry: CSSCustomPropertyDefinition[];

    /**
     * Allows arbitrary registration to the provider before the constructor runs.
     * When the constructor runs, all registration functions in the disconnectedRegistry
     * will be invoked with the provider instance.
     *
     * @public
     */
    public disconnectedRegistry: Array<(provider: DesignSystemProvider) => void> | void;

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

                if (property && property.cssCustomProperty) {
                    this.setCustomProperty({
                        name: property.cssCustomProperty,
                        value,
                    });
                }
            } else {
                this.syncDesignSystemWithProvider();
                const property = this.designSystemProperties[key].cssCustomProperty;
                if (typeof property === "string") {
                    this.deleteCustomProperty(property);
                }

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

        this.$fastController.addBehaviors([designSystemConsumerBehavior]);
    }

    /**
     * @internal
     */
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
                const { cssCustomProperty } = this.designSystemProperties[property];
                if (typeof cssCustomProperty === "string") {
                    this.setCustomProperty({
                        name: cssCustomProperty,
                        value,
                    });
                }
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

        if (Array.isArray(this.disconnectedRegistry)) {
            for (let i = 0; i < this.disconnectedRegistry.length; i++) {
                this.disconnectedRegistry[i](this);
            }

            delete this.disconnectedRegistry;
        }
    }

    /**
     * Register a {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} with the DeignSystemProvider.
     * Registering a {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} will create the CSS custom property.
     *
     * @param behavior - The {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} to register.
     * @public
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
     * Unregister a {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} from the DeignSystemProvider.
     * If all registrations of the definition are unregistered, the CSS custom property will be removed.
     *
     * @param behavior - The {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} to register.
     * @public
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
     *
     * @public
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
            const designProperties = this.designSystemProperties;
            Object.keys(designProperties).forEach((key: string) => {
                const property = designProperties[key];
                if (!this.isValidDesignSystemValue(property)) {
                    this.designSystem[key] = this.provider!.designSystem[key];
                }
            });
        }
    }

    private isValidDesignSystemValue(value: any): boolean {
        return value !== void 0 && value !== null;
    }
}

/**
 * Defines a design-system-provider custom element, registering the tag-name so that the element can be property resolved by {@link DesignSystemConsumer | DesignSystemConsumers}.
 *
 * @param nameOrDef - the name or {@link @microsoft/fast-element#PartialFASTElementDefinition | element definition}
 * @public
 */
export function designSystemProvider(nameOrDef: string | PartialFASTElementDefinition) {
    return <T extends typeof DesignSystemProvider>(providerCtor: T): void => {
        customElement(nameOrDef)(providerCtor);
        providerCtor.registerTagName(
            typeof nameOrDef === "string" ? nameOrDef : nameOrDef.name
        );
    };
}
