import {
    attr,
    Behavior,
    customElement,
    DOM,
    ElementStyles,
    FASTElement,
    observable,
    Observable,
    PartialFASTElementDefinition,
} from "@microsoft/fast-element";
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

const hostSelector = ":host{}";

/**
 * Describes the interface for custom property management object used by the {@link DesignSystemProvider}
 * to manage CSS custom properties.
 *
 * The managers role is to attach a stylesheet to the DesignSystemProvider instance
 * and to write CSS custom properties to that stylesheet instance when required by the
 * DesignSystemProvider.
 */
export interface CustomPropertyManager {
    /**
     * The DesignSystemProvider responsible for evaluating CSSCustomPropertyDefinitions
     */
    readonly owner: DesignSystemProvider | null;

    /**
     * Register and write a CSSCustomPropertyDefinition
     * @param definition - The definition to register
     */
    register(definition: CSSCustomPropertyDefinition): void;

    /**
     * Unregister a CSSCustomPropertyDefinition by name. If there are no other
     * registrations, the CSS custom property will be removed.
     * @param name - The name of the custom property definition to unregister
     */
    unregister(name: string): void;

    /**
     * Write a CSSCustomProperty without registering it
     * @param definition - The definition to write
     */
    set(definition: CSSCustomPropertyDefinition): void;

    /**
     * Sets all CSSCustomPropertyDefinitions that have been registered
     */
    setAll(): void;

    /**
     * Subscribe a DesignSystemProvider instances to the manager.
     * @param provider - The DesignSystemProvider to subscribe
     */
    subscribe?(provider: DesignSystemProvider): void;

    /**
     * Unsubscribe a DesignSystemProvider instance from the manager.
     * @param provider - The DesignSystemProvider to unsubscribe.
     */
    unsubscribe?(provider: DesignSystemProvider): void;

    /**
     * Return whether the DesignSystemProvider instances is subscribed.
     */
    isSubscribed?(provider: DesignSystemProvider): boolean;
}

abstract class CustomPropertyManagerBase implements CustomPropertyManager {
    /**
     * The CSSStyleDeclaration to which all CSS custom properties are written
     */
    protected abstract customPropertyTarget: CSSStyleDeclaration;

    /**
     * {@inheritdoc CustomPropertyManager.owner}
     */
    public get owner(): DesignSystemProvider | null {
        return this._owner;
    }

    /**
     * The private settable owner
     */
    protected _owner: DesignSystemProvider | null = null;

    /**
     * Tracks state of rAF to only invoke property writes once per animation frame
     */
    private ticking: boolean = false;

    /**
     * Stores all CSSCustomPropertyDefinitions registered with the provider.
     */
    private cssCustomPropertyDefinitions: Map<
        string,
        CSSCustomPropertyDefinition & { count: number }
    > = new Map();

    /**
     * {@inheritdoc CustomPropertyManager.register}
     */
    public register(def: CSSCustomPropertyDefinition): void {
        const cached = this.cssCustomPropertyDefinitions.get(def.name);

        if (cached) {
            cached.count += 1;
        } else {
            this.cssCustomPropertyDefinitions.set(def.name, {
                ...def,
                count: 1,
            });
            this.set(def);
        }
    }

    /**
     * {@inheritdoc CustomPropertyManager.unregister}
     */
    public unregister(name: string): void {
        const cached = this.cssCustomPropertyDefinitions.get(name);

        if (cached) {
            cached.count -= 1;

            if (cached.count === 0) {
                this.cssCustomPropertyDefinitions.delete(name);
                this.deleteCustomProperty(name);
            }
        }
    }

    /**
     * {@inheritdoc CustomPropertyManager.set}
     */
    public set = (definition: CSSCustomPropertyDefinition) => {
        if (this.owner) {
            this.customPropertyTarget.setProperty(
                `--${definition.name}`,
                this.owner.evaluate(definition)
            );
        }
    };

    /**
     * {@inheritdoc CustomPropertyManager.set}
     */
    public setAll() {
        if (this.ticking) {
            return;
        }

        this.ticking = true;
        DOM.queueUpdate(() => {
            this.ticking = false;
            this.cssCustomPropertyDefinitions.forEach(def => {
                this.set(def);
            });
        });
    }

    /**
     * Removes a CSS custom property from the provider.
     */
    private deleteCustomProperty = (name: string): void => {
        this.customPropertyTarget.removeProperty(`--${name}`);
    };
}

/**
 * An implementation of {@link CustomPropertyManager} that uses the constructable CSSStyleSheet object.
 * This implementation supports multiple DesignSystemProvider subscriptions.
 *
 * @public
 */
export class ConstructableStylesCustomPropertyManager extends CustomPropertyManagerBase {
    protected readonly sheet: CSSStyleSheet;
    protected styles: ElementStyles;
    protected customPropertyTarget: CSSStyleDeclaration;
    private subscribers = new Set();

    constructor(sheet: CSSStyleSheet) {
        super();

        this.sheet = sheet;

        this.styles = ElementStyles.create([sheet]);

        this.customPropertyTarget = (sheet.rules[
            sheet.insertRule(hostSelector)
        ] as CSSStyleRule).style;
    }

    /**
     * {@inheritdoc CustomPropertyManager.subscribe}
     */
    public subscribe(provider: DesignSystemProvider): void {
        this.subscribers.add(provider);

        if (this.subscribers.size === 1) {
            this._owner = provider;
        }

        provider.cssCustomPropertyDefinitions.forEach(def => {
            this.register(def);
        });

        provider.$fastController.addStyles(this.styles);
    }

    /**
     * {@inheritdoc CustomPropertyManager.unsubscribe}
     */
    public unsubscribe(provider: DesignSystemProvider): void {
        this.subscribers.delete(provider);
        provider.cssCustomPropertyDefinitions.forEach(def => this.unregister(def.name));

        if (this.owner === provider) {
            this._owner = this.subscribers.size
                ? this.subscribers.values().next().value
                : null;
        }

        if (!this.sheet.ownerNode && this.styles) {
            provider.$fastController.removeStyles(this.styles);
        }
    }

    /**
     * {@inheritdoc CustomPropertyManager.isSubscribed}
     */
    public isSubscribed(provider: DesignSystemProvider): boolean {
        return this.subscribers.has(provider);
    }
}

/**
 * An implementation of {@link CustomPropertyManager} that uses the HTMLStyleElement. This implementation
 * does not support multiple DesignSystemProvider subscriptions.
 *
 * @public
 */
export class StyleElementCustomPropertyManager extends CustomPropertyManagerBase {
    public readonly sheet: CSSStyleSheet;
    protected customPropertyTarget: CSSStyleDeclaration;
    public readonly styles: HTMLStyleElement;

    constructor(style: HTMLStyleElement, provider: DesignSystemProvider) {
        super();

        // For HTMLStyleElements we need to attach the element
        // to the DOM prior to accessing the HTMLStyleElement.sheet
        // because the property evaluates null if disconnected
        provider.$fastController.addStyles(style);
        this.sheet = style.sheet!;
        this.styles = style;

        this.customPropertyTarget = (this.sheet.rules[
            this.sheet.insertRule(hostSelector)
        ] as CSSStyleRule).style;

        this._owner = provider;

        provider.cssCustomPropertyDefinitions.forEach(def => {
            this.register(def);
        });
    }
}

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
            const notifier = Observable.getNotifier(prev.designSystem);
            Observable.getAccessors(prev.designSystem).forEach(x => {
                notifier.unsubscribe(this.providerDesignSystemChangeHandler, x.name);
            });
        }

        if (
            next instanceof HTMLElement &&
            DesignSystemProvider.isDesignSystemProvider(next)
        ) {
            const notifier = Observable.getNotifier(next.designSystem);
            Observable.getAccessors(next.designSystem).forEach(x => {
                notifier.subscribe(this.providerDesignSystemChangeHandler, x.name);
            });

            this.syncDesignSystemWithProvider();
        }
    }

    /**
     * Stores a reference to the stylesheet where CSS custom properties are written.
     *
     * @remarks
     * Setting this property can be used to force the DesignSystemProvider to re-use stylesheet references.
     * This is useful for scenarios where there are many of the same DesignSystemProvider elements on the page but
     * all or most share the same configuration, eg Card elements. Be especially careful when re-using stylesheet
     * references in these cases to ensure the element's DesignSystem configurations are the same.
     *
     * This property can only be re-assigned when {@link adoptedStyleSheets | https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets} is supported.
     * If adoptedStyleSheets are not supported, the DesignSystemProvider will write to a HTMLStyleElement
     * reference held internally.
     */
    @observable
    protected customPropertyManager: CustomPropertyManager;
    private customPropertyManagerChanged(
        prev: CustomPropertyManager | void,
        next: CustomPropertyManager
    ) {
        if (prev && prev.unsubscribe) {
            prev.unsubscribe(this);
        }

        if (next.subscribe) {
            next.subscribe(this);
        }
    }

    /**
     * Stores all CSSCustomPropertyDefinitions registered with the provider.
     * @internal
     *
     */
    public cssCustomPropertyDefinitions = new Map<string, CSSCustomPropertyDefinition>();

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
     * Handle changes to design-system-provider IDL and content attributes
     * that reflect to design-system properties.
     */
    private attributeChangeHandler = {
        handleChange: (source: this, key: string) => {
            const value = this[key];
            const manager = this.customPropertyManager;

            if (this.isValidDesignSystemValue(value)) {
                this.designSystem[key] = value;
                const property = this.designSystemProperties[key];

                if (property && property.cssCustomProperty && manager) {
                    manager.set({
                        name: property.cssCustomProperty,
                        value,
                    });
                }
            } else {
                this.syncDesignSystemWithProvider();
                const property = this.designSystemProperties[key].cssCustomProperty;

                if (manager) {
                    if (typeof property === "string") {
                        manager.set({
                            name: property,
                            value: "",
                        });
                    }

                    manager.setAll();
                }
            }
        },
    };

    /**
     * Handle changes to the local design-system property.
     */
    private localDesignSystemChangeHandler = {
        handleChange: () => {
            const manager = this.customPropertyManager;

            if (manager && manager.owner === this) {
                manager.setAll();
            }
        },
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

        // In cases where adoptedStyleSheets *is* supported, the customPropertyStyleSheet is assigned in the connectedCallback
        // to give authors opportunity to assign an initial value. In cases where adoptedStyleSheets are *un-supported*, the
        // property is assigned in the constructor to ensure the DesignSystemProvider initializes the property. The change handler
        // will then prevent any future assignment.
        if (!supportsAdoptedStylesheets) {
            this.customPropertyManager = new StyleElementCustomPropertyManager(
                document.createElement("style"),
                this
            );
        } else {
            this.customPropertyManager = new ConstructableStylesCustomPropertyManager(
                new CSSStyleSheet()
            );
        }

        this.$fastController.addBehaviors([designSystemConsumerBehavior]);
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        if (
            this.customPropertyManager.subscribe &&
            this.customPropertyManager.isSubscribed &&
            !this.customPropertyManager.isSubscribed(this)
        ) {
            this.customPropertyManager.subscribe(this);
        }

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

                if (
                    typeof cssCustomProperty === "string" &&
                    this.customPropertyManager &&
                    this.customPropertyManager.owner === this
                ) {
                    this.customPropertyManager.set({
                        name: cssCustomProperty,
                        value: this[property],
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

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.customPropertyManager.unsubscribe) {
            this.customPropertyManager.unsubscribe(this);
        }
    }

    /**
     * Register a {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} with the DeignSystemProvider.
     * Registering a {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} will create the CSS custom property.
     *
     * @param def - The {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} to register.
     * @public
     */
    public registerCSSCustomProperty(def: CSSCustomPropertyDefinition) {
        this.cssCustomPropertyDefinitions.set(def.name, def);
        this.customPropertyManager.register(def);
    }

    /**
     * Unregister a {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} from the DeignSystemProvider.
     * If all registrations of the definition are unregistered, the CSS custom property will be removed.
     *
     * @param def - The {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} to register.
     * @public
     */
    public unregisterCSSCustomProperty(def: CSSCustomPropertyDefinition) {
        this.cssCustomPropertyDefinitions.delete(def.name);
        this.customPropertyManager.unregister(def.name);
    }

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
            const localDSAccessors = Observable.getAccessors(this.designSystem).reduce(
                (prev, next) => {
                    prev[next.name] = next;
                    return prev;
                },
                {}
            );

            Observable.getAccessors(this.provider.designSystem).forEach(x => {
                // If the property is not enumerated as a DesignSystemProperty,
                // Or it is but the property is unset on the this provider instance,
                // And the parent value *is* a valid value,
                // Sync the value from the parent provider's designSystem to the local designSystem
                if (
                    (!this.designSystemProperties.hasOwnProperty(x.name) ||
                        !this.isValidDesignSystemValue(this[x.name])) &&
                    this.isValidDesignSystemValue(this.provider?.designSystem[x.name])
                ) {
                    if (!localDSAccessors[x.name]) {
                        Observable.defineProperty(this.designSystem, x.name);
                    }

                    this.designSystem[x.name] = this.provider!.designSystem[x.name];
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
export function defineDesignSystemProvider(
    nameOrDef: string | PartialFASTElementDefinition
) {
    return <T extends typeof DesignSystemProvider>(providerCtor: T): void => {
        customElement(nameOrDef)(providerCtor);
        providerCtor.registerTagName(
            typeof nameOrDef === "string" ? nameOrDef : nameOrDef.name
        );
    };
}

/**
 * @internal
 * @deprecated - use {@link defineDesignSystemProvider}
 */
export const designSystemProvider = defineDesignSystemProvider;
