import {
    attr,
    ElementController,
    FAST,
    FASTElement,
    FASTElementDefinition,
    fastElementRegistry,
    type TemplateLifecycleCallbacks,
} from "@microsoft/fast-element";
import "@microsoft/fast-element/install-hydratable-view-templates.js";
import { Message } from "../interfaces.js";
import { AttributeMap } from "./attribute-map.js";
import { ObserverMap } from "./observer-map.js";
import { Schema } from "./schema.js";
import { TemplateParser } from "./template-parser.js";
import { eventArgAccessor, transformInnerHTML } from "./utilities.js";

/**
 * Values for the observerMap element option.
 */
export const ObserverMapOption = {
    all: "all",
} as const;

/**
 * A node in the observer-map path tree.
 *
 * - `true`  → observe this path and all descendants (unless overridden by children).
 * - `false` → do NOT observe this path or its descendants (unless overridden by children).
 * - `ObserverMapPathNode` → configure child paths individually;
 *       the node itself is observed if `$observe` is true (default when parent is observed).
 */
export type ObserverMapPathEntry = boolean | ObserverMapPathNode;

/**
 * A node object in the observer-map path tree.
 *
 * `$observe` controls whether this node itself is observed.
 * When omitted the value is inherited from the nearest ancestor
 * that explicitly sets `$observe`. At the root level the default is `true`.
 *
 * Child property overrides are keyed by property name.
 */
export interface ObserverMapPathNode {
    $observe?: boolean;
    [propertyName: string]: ObserverMapPathEntry | undefined;
}

/**
 * Configuration object for the observerMap element option.
 * When `properties` is omitted (i.e. `observerMap: {}`), behaves like `"all"` —
 * every root property is observed. When `properties` is present, only listed
 * root properties participate in observer-map observation.
 */
export interface ObserverMapConfig {
    /**
     * Per-root-property observation control.
     * Keys are root property names discovered in the template schema.
     * Only root properties listed here participate in observer-map observation.
     * Omitting this field is equivalent to `"all"`.
     */
    properties?: {
        [rootProperty: string]: ObserverMapPathEntry;
    };
}

/**
 * Type for the observerMap element option.
 * Accepts `"all"` or a configuration object.
 */
export type ObserverMapOption =
    | (typeof ObserverMapOption)[keyof typeof ObserverMapOption]
    | ObserverMapConfig;

/**
 * Values for the attributeMap element option.
 */
export const AttributeMapOption = {
    all: "all",
} as const;

/**
 * Configuration object for the attributeMap element option.
 * Passing an empty object (`{}`) is equivalent to `"all"`.
 */
export interface AttributeMapConfig {
    /**
     * Strategy for mapping template binding keys to HTML attribute names.
     *
     * - `"none"` (default): the binding key is used as-is for both the
     *   property name and the attribute name (e.g. `{{foo-bar}}` →
     *   property `foo-bar`, attribute `foo-bar`).
     * - `"camelCase"`: the binding key is treated as a camelCase property
     *   name and the attribute name is derived by converting it to
     *   kebab-case (e.g. `{{fooBar}}` → property `fooBar`, attribute
     *   `foo-bar`). This matches the build-time `attribute-name-strategy`
     *   option in `@microsoft/fast-build`.
     */
    "attribute-name-strategy"?: "none" | "camelCase";
}

/**
 * Type for the attributeMap element option.
 * Accepts `"all"` or a configuration object.
 */
export type AttributeMapOption =
    | (typeof AttributeMapOption)[keyof typeof AttributeMapOption]
    | AttributeMapConfig;

/**
 * Element options the TemplateElement will use to update the registered element
 */
export interface ElementOptions {
    observerMap?: ObserverMapOption;
    attributeMap?: AttributeMapOption;
}

/**
 * A dictionary of element options the TemplateElement will use to update the registered element
 */
export interface ElementOptionsDictionary<ElementOptionsType = ElementOptions> {
    [key: string]: ElementOptionsType;
}

/**
 * Checks whether a map option (observerMap or attributeMap) is enabled.
 * An option is enabled when it is `"all"` or a plain configuration object.
 */
function isMapOptionEnabled(
    option: ObserverMapOption | AttributeMapOption | undefined,
): boolean {
    if (option === "all") {
        return true;
    }

    return typeof option === "object" && !Array.isArray(option);
}

/**
 * Lifecycle callbacks for template events.
 * Combines template lifecycle callbacks with template-processing events.
 */
export interface HydrationLifecycleCallbacks extends TemplateLifecycleCallbacks {
    /**
     * Called after the JS class definition has been registered
     */
    elementDidRegister?(name: string): void;

    /**
     * Called before the template has been evaluated and assigned
     */
    templateWillUpdate?(name: string): void;

    /**
     * Called once when the first element enters the hydration pipeline.
     */
    hydrationStarted?(): void;

    /**
     * Called before an individual element's hydration begins
     */
    elementWillHydrate?(source: HTMLElement): void;

    /**
     * Called after an individual element's hydration has finished
     */
    elementDidHydrate?(source: HTMLElement): void;

    /**
     * Called after all elements have completed hydration
     */
    hydrationComplete?(): void;
}

/**
 * The <f-template> custom element that will provide view logic to the element.
 *
 * Acts as the bridge between declarative HTML templates and the FAST element
 * registry. Lifecycle orchestration (registration, options, callbacks) lives
 * here; template parsing is delegated to {@link TemplateParser}.
 */
class TemplateElement extends FASTElement {
    /**
     * The name of the custom element this template will be applied to
     */
    @attr
    public name?: string;

    /**
     * A dictionary of custom element options
     */
    public static elementOptions: ElementOptionsDictionary = {};

    /**
     * ObserverMap instance for caching binding paths
     */
    private observerMap?: ObserverMap;

    /**
     * AttributeMap instance for defining @attr properties
     */
    private attributeMap?: AttributeMap;

    /**
     * Default element options
     */
    private static defaultElementOptions: ElementOptions = {};

    /**
     * Metadata containing JSON schema for properties on a custom element
     */
    private schema?: Schema;

    /**
     * Lifecycle callbacks for hydration events
     */
    private static lifecycleCallbacks: HydrationLifecycleCallbacks = {};

    /**
     * Configure lifecycle callbacks for hydration events.
     *
     * @param callbacks - Lifecycle callbacks to configure.
     * @returns The {@link TemplateElement} class.
     */
    public static config(callbacks: HydrationLifecycleCallbacks) {
        TemplateElement.lifecycleCallbacks = callbacks;

        // Forward hydration callbacks to ElementController for
        // element-level hydration tracking.
        ElementController.configHydration({
            hydrationStarted: callbacks.hydrationStarted,
            elementWillHydrate: callbacks.elementWillHydrate,
            elementDidHydrate: callbacks.elementDidHydrate,
            hydrationComplete: callbacks.hydrationComplete,
        });

        return this;
    }

    /**
     * Set options for custom elements.
     *
     * @param elementOptions - A dictionary of custom element options
     * @returns The TemplateElement class.
     */
    public static options(elementOptions: ElementOptionsDictionary = {}) {
        const result: ElementOptionsDictionary = {};

        for (const key in elementOptions) {
            const value = elementOptions[key];
            result[key] = {
                observerMap: value.observerMap,
                attributeMap: value.attributeMap,
            };
        }

        TemplateElement.elementOptions = result;

        return this;
    }

    constructor() {
        super();

        // Ensure elementOptions is initialized if it's empty
        if (
            !TemplateElement.elementOptions ||
            Object.keys(TemplateElement.elementOptions).length === 0
        ) {
            TemplateElement.options();
        }
    }

    /**
     * Set options for a custom element
     * @param name - The name of the custom element to set options for.
     */
    private static setOptions(name: string): void {
        if (!TemplateElement.elementOptions[name]) {
            TemplateElement.elementOptions[name] = TemplateElement.defaultElementOptions;
        }
    }

    connectedCallback(): void {
        super.connectedCallback();
        const name = this.name;

        if (typeof name !== "string") {
            return;
        }

        this.schema = new Schema(name);

        FASTElementDefinition.registerAsync(name).then(async value => {
            TemplateElement.lifecycleCallbacks.elementDidRegister?.(name);

            if (!TemplateElement.elementOptions?.[name]) {
                TemplateElement.setOptions(name);
            }

            const schema = this.schema!;

            if (isMapOptionEnabled(TemplateElement.elementOptions[name]?.observerMap)) {
                const observerMapOption =
                    TemplateElement.elementOptions[name]?.observerMap;
                const observerMapConfig =
                    typeof observerMapOption === "object" && observerMapOption !== null
                        ? observerMapOption
                        : undefined;

                this.observerMap = new ObserverMap(
                    value.prototype,
                    schema,
                    observerMapConfig,
                );
            }

            const registeredFastElement: FASTElementDefinition | undefined =
                fastElementRegistry.getByType(value);

            if (isMapOptionEnabled(TemplateElement.elementOptions[name]?.attributeMap)) {
                const mapOption = TemplateElement.elementOptions[name]?.attributeMap;
                const mapConfig: AttributeMapConfig | undefined =
                    typeof mapOption === "object" ? mapOption : undefined;

                this.attributeMap = new AttributeMap(
                    value.prototype,
                    schema,
                    registeredFastElement,
                    mapConfig,
                );
            }

            const templates = this.getElementsByTagName("template");

            if (templates.length === 1) {
                // Callback: Before template has been evaluated and assigned
                TemplateElement.lifecycleCallbacks.templateWillUpdate?.(name);

                const innerHTML = transformInnerHTML(this.innerHTML);
                const parser = new TemplateParser();

                const { strings, values } = parser.parse(innerHTML, schema);

                if (parser.hasDeprecatedEventSyntax) {
                    console.warn(
                        `[fast-html] Using "e" as an event argument is deprecated` +
                            ` in component "${name}".` +
                            ` Use "${eventArgAccessor}" instead.`,
                    );
                }

                // Define the root properties cached in the observer map as observable (only if observerMap exists)
                this.observerMap?.defineProperties();

                // Define the leaf properties as @attr (only if attributeMap exists)
                this.attributeMap?.defineProperties();

                if (registeredFastElement) {
                    // Attach lifecycle callbacks to the definition before assigning template
                    // This allows the Observable notification to trigger the callbacks
                    (registeredFastElement as any).lifecycleCallbacks = {
                        templateDidUpdate:
                            TemplateElement.lifecycleCallbacks.templateDidUpdate,
                        elementDidDefine:
                            TemplateElement.lifecycleCallbacks.elementDidDefine,
                    };

                    // All new elements will get the updated template
                    // This assignment triggers the Observable notification → callbacks fire
                    registeredFastElement.template = parser.createTemplate(
                        strings,
                        values,
                    );
                }
            } else if (templates.length > 1) {
                throw FAST.error(Message.moreThanOneTemplateProvided, {
                    name: this.name,
                });
            } else {
                throw FAST.error(Message.noTemplateProvided, { name: this.name });
            }
        });
    }
}

export { TemplateElement };
