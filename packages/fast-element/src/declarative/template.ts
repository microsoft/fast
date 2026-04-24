import { attr } from "../components/attributes.js";
import { ElementController } from "../components/element-controller.js";
import {
    FASTElementDefinition,
    fastElementRegistry,
    type TemplateLifecycleCallbacks,
} from "../components/fast-definitions.js";
import { FASTElement } from "../components/fast-element.js";
import { FAST } from "../platform.js";
import { AttributeMap, type AttributeMapConfig } from "./attribute-map.js";
import {
    getDefinitionElementOptions,
    mergeElementOptions,
} from "./definition-options.js";
import { Message } from "./interfaces.js";
import { ObserverMap, type ObserverMapConfig } from "./observer-map.js";
import { Schema } from "./schema.js";
import { TemplateParser } from "./template-parser.js";
import { transformInnerHTML } from "./utilities.js";

/**
 * Checks whether a map option (observerMap or attributeMap) is enabled.
 * An option is enabled when it is a plain configuration object.
 */
function isMapOptionEnabled(
    option: ObserverMapConfig | AttributeMapConfig | undefined,
): boolean {
    return typeof option === "object" && !Array.isArray(option);
}

/**
 * Element options the TemplateElement will use to update the registered element
 */
export interface ElementOptions {
    observerMap?: ObserverMapConfig;
    attributeMap?: AttributeMapConfig;
}

/**
 * A dictionary of element options the TemplateElement will use to update the registered element
 */
export interface ElementOptionsDictionary<ElementOptionsType = ElementOptions> {
    [key: string]: ElementOptionsType;
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
     * A dictionary of fallback custom element options
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
     * Set fallback options for custom elements.
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

        FASTElementDefinition.register(name).then(async value => {
            // Definitions are registered before FASTElement.define() finishes applying
            // extensions. Yield once so definition-scoped declarative options are
            // available before schema processing and template assignment begin.
            await Promise.resolve();

            TemplateElement.lifecycleCallbacks.elementDidRegister?.(name);

            if (!TemplateElement.elementOptions?.[name]) {
                TemplateElement.setOptions(name);
            }

            const schema = this.schema!;
            const registeredFastElement: FASTElementDefinition | undefined =
                fastElementRegistry.getByType(value);
            const elementOptions = mergeElementOptions(
                TemplateElement.elementOptions[name],
                getDefinitionElementOptions(registeredFastElement),
            );

            if (isMapOptionEnabled(elementOptions?.observerMap)) {
                const observerMapOption = elementOptions?.observerMap;
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

            if (isMapOptionEnabled(elementOptions?.attributeMap)) {
                const mapOption = elementOptions?.attributeMap;
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

                // Define the root properties cached in the observer map as observable (only if observerMap exists)
                this.observerMap?.defineProperties();

                // Define the leaf properties as @attr (only if attributeMap exists)
                this.attributeMap?.defineProperties();

                if (registeredFastElement) {
                    const hadTemplate = registeredFastElement.template !== undefined;

                    // Attach lifecycle callbacks to the definition before assigning template
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

                    TemplateElement.lifecycleCallbacks.templateDidUpdate?.(name);

                    if (!hadTemplate && registeredFastElement.isDefined) {
                        TemplateElement.lifecycleCallbacks.elementDidDefine?.(name);
                    }
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
