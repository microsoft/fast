import { attr } from "../components/attributes.js";
import {
    FASTElementDefinition,
    type FASTElementTemplateResolver,
    type TemplateLifecycleCallbacks,
} from "../components/fast-definitions.js";
import { FASTElement } from "../components/fast-element.js";
import { enableHydration } from "../components/enable-hydration.js";
import { FAST } from "../platform.js";
import type { ElementViewTemplate } from "../templating/template.js";
import { AttributeMap, type AttributeMapConfig } from "./attribute-map.js";
import {
    getDefinitionElementOptions,
    mergeElementOptions,
} from "./definition-options.js";
import { Message } from "./interfaces.js";
import { ObserverMap, type ObserverMapConfig } from "./observer-map.js";
import { ensureDeclarativeRuntime } from "./runtime.js";
import { Schema } from "./schema.js";
import { declarativeTemplateBridge, type TemplatePublisher } from "./template-bridge.js";
import { TemplateParser } from "./template-parser.js";
import { transformInnerHTML } from "./utilities.js";

const templateElementName = "f-template";

const ensuredTemplateElements = new WeakMap<CustomElementRegistry, Promise<void>>();

function isTemplateElementConstructor(value: Function | undefined): boolean {
    return value === TemplateElement || value?.prototype instanceof TemplateElement;
}

async function ensureTemplateElementDefined(
    registry: CustomElementRegistry,
): Promise<void> {
    const ensured = ensuredTemplateElements.get(registry);

    if (ensured) {
        return ensured;
    }

    const existing = registry.get(templateElementName);

    const definitionPromise =
        existing !== void 0
            ? isTemplateElementConstructor(existing)
                ? Promise.resolve()
                : Promise.reject(
                      new Error(
                          "The <f-template> element is already defined in this registry by a different implementation.",
                      ),
                  )
            : TemplateElement.define({
                  name: templateElementName,
                  registry,
              }).then(() => void 0);

    const pending = definitionPromise.catch(error => {
        ensuredTemplateElements.delete(registry);
        throw error;
    });

    ensuredTemplateElements.set(registry, pending);

    return pending;
}

function chainLifecycleCallback<TArgs extends unknown[]>(
    first: ((...args: TArgs) => void) | undefined,
    second: ((...args: TArgs) => void) | undefined,
): ((...args: TArgs) => void) | undefined {
    if (!first) {
        return second;
    }

    if (!second) {
        return first;
    }

    return (...args: TArgs) => {
        first(...args);
        second(...args);
    };
}

/**
 * Checks whether a map option (observerMap or attributeMap) is enabled.
 * An option is enabled when it is a plain configuration object.
 */
function isMapOptionEnabled(
    option: ObserverMapConfig | AttributeMapConfig | undefined,
): boolean {
    return typeof option === "object" && !Array.isArray(option);
}

type MutableFASTElementDefinition = FASTElementDefinition & {
    lifecycleCallbacks?: TemplateLifecycleCallbacks;
};

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
 *
 * @remarks
 * This interface combines template lifecycle callbacks with
 * global hydration events. It is accepted by
 * {@link TemplateElement.config} for backward compatibility.
 * New code should prefer {@link enableHydration} for global
 * hydration events and pass per-element callbacks directly to
 * {@link declarativeTemplate}.
 *
 * @deprecated Use {@link enableHydration} and {@link declarativeTemplate} callbacks instead.
 * @public
 */
export interface HydrationLifecycleCallbacks extends TemplateLifecycleCallbacks {
    /**
     * Called once when the first element enters the hydration pipeline.
     */
    hydrationStarted?(): void;

    /**
     * Called after all elements have completed hydration.
     */
    hydrationComplete?(): void;
}

/**
 * Returns a declarative template resolver that waits for the matching
 * `<f-template>` element and resolves it into a concrete `ViewTemplate`.
 *
 * @param callbacks - Optional per-element lifecycle callbacks.
 * @public
 */
export function declarativeTemplate(
    callbacks?: TemplateLifecycleCallbacks,
): FASTElementTemplateResolver {
    ensureDeclarativeRuntime();

    return async definition => {
        if (callbacks) {
            const existing = definition.lifecycleCallbacks;
            (definition as MutableFASTElementDefinition).lifecycleCallbacks = {
                elementDidRegister: chainLifecycleCallback(
                    existing?.elementDidRegister,
                    callbacks.elementDidRegister,
                ),
                templateWillUpdate: chainLifecycleCallback(
                    existing?.templateWillUpdate,
                    callbacks.templateWillUpdate,
                ),
                templateDidUpdate: chainLifecycleCallback(
                    existing?.templateDidUpdate,
                    callbacks.templateDidUpdate,
                ),
                elementDidDefine: chainLifecycleCallback(
                    existing?.elementDidDefine,
                    callbacks.elementDidDefine,
                ),
                elementWillHydrate: chainLifecycleCallback(
                    existing?.elementWillHydrate,
                    callbacks.elementWillHydrate,
                ),
                elementDidHydrate: chainLifecycleCallback(
                    existing?.elementDidHydrate,
                    callbacks.elementDidHydrate,
                ),
            };
        }

        await ensureTemplateElementDefined(definition.registry);
        return declarativeTemplateBridge.requestTemplate(definition);
    };
}

/**
 * The <f-template> custom element that will provide view logic to the element.
 *
 * Acts as the bridge between declarative HTML templates and the FAST element
 * registry. Lifecycle orchestration (registration, options, callbacks) lives
 * here; template parsing is delegated to {@link TemplateParser}.
 */
class TemplateElement extends FASTElement implements TemplatePublisher {
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
     * Default element options
     */
    private static defaultElementOptions: ElementOptions = {};

    /**
     * Lifecycle callbacks configured via {@link TemplateElement.config}.
     * @deprecated Prefer per-element callbacks via {@link declarativeTemplate}.
     */
    private static lifecycleCallbacks: HydrationLifecycleCallbacks = {};

    /**
     * Configure lifecycle callbacks for hydration events.
     *
     * @deprecated Use {@link enableHydration} for global hydration events
     * and pass per-element callbacks to {@link declarativeTemplate} instead.
     *
     * @param callbacks - Lifecycle callbacks to configure.
     * @returns The {@link TemplateElement} class.
     */
    public static config(callbacks: HydrationLifecycleCallbacks) {
        TemplateElement.lifecycleCallbacks = callbacks;

        // Forward global hydration callbacks to ElementController
        if (callbacks.hydrationStarted || callbacks.hydrationComplete) {
            enableHydration({
                hydrationStarted: callbacks.hydrationStarted,
                hydrationComplete: callbacks.hydrationComplete,
            });
        }

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

        if (
            !TemplateElement.elementOptions ||
            Object.keys(TemplateElement.elementOptions).length === 0
        ) {
            TemplateElement.options();
        }
    }

    connectedCallback(): void {
        super.connectedCallback();
        declarativeTemplateBridge.registerPublisher(this.registry, this.name, this);
    }

    disconnectedCallback(): void {
        declarativeTemplateBridge.unregisterPublisher(this.registry, this.name, this);
        super.disconnectedCallback();
    }

    public nameChanged(
        previousName: string | undefined,
        nextName: string | undefined,
    ): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        declarativeTemplateBridge.movePublisher(
            this.registry,
            previousName,
            nextName,
            this,
        );
    }

    /**
     * Publish a concrete template for the supplied definition.
     * @internal
     */
    public publishTemplate(definition: FASTElementDefinition): ElementViewTemplate {
        ensureDeclarativeRuntime();

        const name = definition.name;
        const templates = this.getElementsByTagName("template");

        if (templates.length > 1) {
            throw FAST.error(Message.moreThanOneTemplateProvided, {
                name,
            });
        }

        if (templates.length === 0) {
            throw FAST.error(Message.noTemplateProvided, { name });
        }

        // Fire from definition-level callbacks (set by declarativeTemplate())
        definition.lifecycleCallbacks?.elementDidRegister?.(name);
        // Fire from static callbacks (set by TemplateElement.config())
        TemplateElement.lifecycleCallbacks.elementDidRegister?.(name);

        definition.lifecycleCallbacks?.templateWillUpdate?.(name);
        TemplateElement.lifecycleCallbacks.templateWillUpdate?.(name);

        const schema = new Schema(name);
        const innerHTML = transformInnerHTML(this.innerHTML);
        const parser = new TemplateParser();
        const { strings, values } = parser.parse(innerHTML, schema);

        const elementOptions = this.getElementOptions(definition);

        if (isMapOptionEnabled(elementOptions?.attributeMap)) {
            const option = elementOptions!.attributeMap;
            const config: AttributeMapConfig | undefined =
                typeof option === "object" ? option : undefined;
            const attributeMap = new AttributeMap(
                definition.type.prototype,
                schema,
                definition,
                config,
            );

            attributeMap.defineProperties();
        }

        if (isMapOptionEnabled(elementOptions?.observerMap)) {
            const option = elementOptions!.observerMap;
            const config =
                typeof option === "object" && option !== null ? option : undefined;
            const observerMap = new ObserverMap(
                definition.type.prototype,
                schema,
                config,
            );

            observerMap.defineProperties();
        }

        this.attachLifecycleCallbacks(definition);

        return parser.createTemplate(strings, values);
    }

    private static setOptions(name: string): void {
        if (!TemplateElement.elementOptions[name]) {
            TemplateElement.elementOptions[name] = TemplateElement.defaultElementOptions;
        }
    }

    private get registry(): CustomElementRegistry {
        return FASTElementDefinition.getForInstance(this)?.registry ?? customElements;
    }

    private getElementOptions(
        definition: FASTElementDefinition,
    ): ElementOptions | undefined {
        if (!TemplateElement.elementOptions?.[definition.name]) {
            TemplateElement.setOptions(definition.name);
        }

        return mergeElementOptions(
            TemplateElement.elementOptions[definition.name],
            getDefinitionElementOptions(definition),
        );
    }

    private attachLifecycleCallbacks(definition: FASTElementDefinition): void {
        const defCallbacks = definition.lifecycleCallbacks;
        const staticCallbacks = TemplateElement.lifecycleCallbacks;

        const templateDidUpdate = chainLifecycleCallback(
            defCallbacks?.templateDidUpdate,
            staticCallbacks.templateDidUpdate,
        );
        const elementDidDefine = chainLifecycleCallback(
            defCallbacks?.elementDidDefine,
            staticCallbacks.elementDidDefine,
        );
        const elementWillHydrate = chainLifecycleCallback(
            defCallbacks?.elementWillHydrate,
            staticCallbacks.elementWillHydrate,
        );
        const elementDidHydrate = chainLifecycleCallback(
            defCallbacks?.elementDidHydrate,
            staticCallbacks.elementDidHydrate,
        );

        if (
            !templateDidUpdate &&
            !elementDidDefine &&
            !elementWillHydrate &&
            !elementDidHydrate
        ) {
            return;
        }

        (definition as MutableFASTElementDefinition).lifecycleCallbacks = {
            ...defCallbacks,
            templateDidUpdate,
            elementDidDefine,
            elementWillHydrate,
            elementDidHydrate,
        };
    }
}

export { TemplateElement };
