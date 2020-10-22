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
const customPropertyStylesheetCache = new Map<CSSStyleSheet, CustomPropertyManager>();

class CustomPropertyManager {
    /**
     * The stylesheet to which custom properties are written
     */
    public readonly sheet: CSSStyleSheet;

    /**
     * The element that owns the manager. This is the only element that should write to the
     */
    public get owner(): DesignSystemProvider | null {
        return this._owner;
    }

    private _owner: DesignSystemProvider | null = null;

    private subscribers = new Set();

    private customPropertyTarget: CSSStyleDeclaration;

    private styles: ElementStyles | void;

    private ticking: boolean = false;

    /**
     * Stores all CSSCustomPropertyDefinitions registered with the provider.
     */
    private cssCustomPropertyDefinitions: Map<
        string,
        CSSCustomPropertyDefinition & { count: number }
    > = new Map();

    constructor(sheet: CSSStyleSheet) {
        this.sheet = sheet;

        this.customPropertyTarget = (sheet.rules[
            sheet.insertRule(hostSelector)
        ] as CSSStyleRule).style;

        // If sheet is not connected to an HTMLStyleElement
        if (!sheet.ownerNode) {
            this.styles = ElementStyles.create([this.sheet]);
        }
    }

    /**
     * Unregister a {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} from the DeignSystemProvider.
     * If all registrations of the definition are unregistered, the CSS custom property will be removed.
     *
     * @param behavior - The {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} to register.
     * @public
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
    public subscribe(dsp: DesignSystemProvider): void {
        this.subscribers.add(dsp);

        if (this.subscribers.size === 1) {
            this._owner = dsp;
        }

        if (!this.sheet.ownerNode && this.styles) {
            dsp.$fastController.addStyles(this.styles);
        }

        // TODO: register any custom properties registered to the DSP
    }
    public unsubscribe(dsp: DesignSystemProvider): void {
        this.subscribers.delete(dsp);

        if (this.owner === dsp) {
            this._owner = this.subscribers.size
                ? this.subscribers.values().next().value
                : null;
        }

        if (!this.sheet.ownerNode && this.styles) {
            dsp.$fastController.removeStyles(this.styles);
        }

        // TODO: un-register any custom properties registered to the DSP
    }

    /**
     * Writes a CSS custom property to the design system provider,
     * evaluating any function values with the design system.
     */
    public set = (definition: CSSCustomPropertyDefinition) => {
        if (this.owner) {
            this.customPropertyTarget.setProperty(
                `--${definition.name}`,
                this.owner.evaluate(definition)
            );
        }
    };

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
    protected customPropertyStyleSheet: CSSStyleSheet;
    private customPropertyStyleSheetChanged(
        prev: CSSStyleSheet | void,
        next: CSSStyleSheet
    ) {
        if (!supportsAdoptedStylesheets && prev) {
            // An app author has tried to re-assign this property when adoptedStyleSheets is not supported. Warn that this is not supported.
            console.warn(
                `Assigning ${this.constructor.name}.${DesignSystemProvider.prototype.customPropertyStyleSheetChanged.name} when adoptedStyleSheets is unsupported is not allowed. Avoid setting this property when adoptedStyleSheets is unsupported.`
            );
            this.customPropertyStyleSheet = prev;
            return;
        }

        let nextManager = customPropertyStylesheetCache.get(next);

        if (!nextManager) {
            nextManager = new CustomPropertyManager(next);
            customPropertyStylesheetCache.set(next, nextManager);
        }

        nextManager.subscribe(this);

        if (prev) {
            const prevManager = customPropertyStylesheetCache.get(prev);

            if (prevManager) {
                prevManager.unsubscribe(this);
            }
        }
    }

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
            const manager = customPropertyStylesheetCache.get(
                this.customPropertyStyleSheet
            );

            if (this.isValidDesignSystemValue(value)) {
                this.designSystem[key] = value;
                const property = this.designSystemProperties[key];

                if (
                    property &&
                    property.cssCustomProperty &&
                    manager &&
                    manager.owner === this
                ) {
                    manager.set({
                        name: property.cssCustomProperty,
                        value,
                    });
                }
            } else {
                this.syncDesignSystemWithProvider();
                const property = this.designSystemProperties[key].cssCustomProperty;

                if (manager?.owner === this) {
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
            const manager = customPropertyStylesheetCache.get(
                this.customPropertyStyleSheet
            );

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
            const element = document.createElement("style");
            this.$fastController.addStyles(element);
            this.customPropertyStyleSheet = element.sheet!;
        }

        this.$fastController.addBehaviors([designSystemConsumerBehavior]);
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        if (supportsAdoptedStylesheets && !this.customPropertyStyleSheet) {
            this.customPropertyStyleSheet = new CSSStyleSheet();
        }

        super.connectedCallback();

        const selfNotifier = Observable.getNotifier(this);
        const designSystemNotifier = Observable.getNotifier(this.designSystem);
        const manager = customPropertyStylesheetCache.get(this.customPropertyStyleSheet);

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
                    manager &&
                    manager.owner === this
                ) {
                    manager.set({
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

    /**
     * Register a {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} with the DeignSystemProvider.
     * Registering a {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} will create the CSS custom property.
     *
     * @param behavior - The {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} to register.
     * @public
     */
    public registerCSSCustomProperty(behavior: CSSCustomPropertyDefinition) {
        const manager = customPropertyStylesheetCache.get(this.customPropertyStyleSheet);

        if (manager) {
            manager.register(behavior);
        }
    }

    /**
     * Unregister a {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} from the DeignSystemProvider.
     * If all registrations of the definition are unregistered, the CSS custom property will be removed.
     *
     * @param def - The {@link @microsoft/fast-foundation#CSSCustomPropertyDefinition} to register.
     * @public
     */
    public unregisterCSSCustomProperty(def: CSSCustomPropertyDefinition) {
        const manager = customPropertyStylesheetCache.get(this.customPropertyStyleSheet);

        if (manager) {
            manager.unregister(def.name);
        }
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
