import {
    attr,
    ElementController,
    FAST,
    FASTElement,
    FASTElementDefinition,
    fastElementRegistry,
    type PartialFASTElementDefinition,
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
 * Options for the {@link observerMap} currying function.
 */
export interface ObserverMapOptions {
    /**
     * An explicit schema instance. When provided the observer map
     * will use this schema instead of waiting for one to be parsed
     * from the template. An error is thrown when no schema is
     * available and none was explicitly passed.
     */
    schema?: Schema;
    /**
     * Configuration for per-property observation control.
     */
    config?: ObserverMapConfig;
}

/**
 * Options for the {@link attributeMap} currying function.
 */
export interface AttributeMapOptions {
    /**
     * An explicit schema instance. When provided the attribute map
     * will use this schema instead of waiting for one to be parsed
     * from the template.
     */
    schema?: Schema;
    /**
     * Configuration for attribute name strategy.
     */
    config?: AttributeMapConfig;
}

/**
 * Stored pending observer-map configuration for a named element.
 * @internal
 */
interface PendingObserverMap {
    schema?: Schema;
    config?: ObserverMapConfig;
}

/**
 * Stored pending attribute-map configuration for a named element.
 * @internal
 */
interface PendingAttributeMap {
    schema?: Schema;
    config?: AttributeMapConfig;
}

/**
 * Registry of pending observer-map configurations keyed by element name.
 * Consumed during {@link TemplateElement} connected callback.
 */
const pendingObserverMaps: Map<string, PendingObserverMap> = new Map();

/**
 * Registry of pending attribute-map configurations keyed by element name.
 * Consumed during {@link TemplateElement} connected callback.
 */
const pendingAttributeMaps: Map<string, PendingAttributeMap> = new Map();

/**
 * Resolves a custom element name from a `string | PartialFASTElementDefinition`.
 */
function resolveElementName(nameOrDef: string | PartialFASTElementDefinition): string {
    return typeof nameOrDef === "string" ? nameOrDef : nameOrDef.name;
}

/**
 * Creates a curried function that registers observer-map configuration
 * for a custom element. The returned function accepts the element name
 * or a `PartialFASTElementDefinition` and stores the configuration for
 * consumption during template parsing.
 *
 * @param options - Optional schema and configuration for observation.
 * @returns A function that accepts `string | PartialFASTElementDefinition`
 *   and registers the pending observer-map configuration.
 *
 * @example
 * ```ts
 * // Observe all root properties (auto-detect schema from template)
 * observerMap()("my-element");
 *
 * // Explicit schema and selective property observation
 * observerMap({ schema: mySchema, config: { properties: { user: true } } })("my-element");
 *
 * // Using a PartialFASTElementDefinition
 * observerMap()({ name: "my-element" });
 * ```
 */
export function observerMap(
    options?: ObserverMapOptions,
): (nameOrDef: string | PartialFASTElementDefinition) => void {
    return (nameOrDef: string | PartialFASTElementDefinition): void => {
        const name = resolveElementName(nameOrDef);
        pendingObserverMaps.set(name, {
            schema: options?.schema,
            config: options?.config,
        });
    };
}

/**
 * Creates a curried function that registers attribute-map configuration
 * for a custom element. The returned function accepts the element name
 * or a `PartialFASTElementDefinition` and stores the configuration for
 * consumption during template parsing.
 *
 * @param options - Optional schema and configuration for attribute mapping.
 * @returns A function that accepts `string | PartialFASTElementDefinition`
 *   and registers the pending attribute-map configuration.
 *
 * @example
 * ```ts
 * // Map all leaf properties as attributes (default strategy)
 * attributeMap()("my-element");
 *
 * // Use camelCase naming strategy
 * attributeMap({ config: { "attribute-name-strategy": "camelCase" } })("my-element");
 *
 * // Using a PartialFASTElementDefinition
 * attributeMap()({ name: "my-element" });
 * ```
 */
export function attributeMap(
    options?: AttributeMapOptions,
): (nameOrDef: string | PartialFASTElementDefinition) => void {
    return (nameOrDef: string | PartialFASTElementDefinition): void => {
        const name = resolveElementName(nameOrDef);
        pendingAttributeMaps.set(name, {
            schema: options?.schema,
            config: options?.config,
        });
    };
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
 * registry. Lifecycle orchestration (registration, callbacks) lives
 * here; template parsing is delegated to {@link TemplateParser}.
 *
 * Observer-map and attribute-map configurations are registered via the
 * standalone {@link observerMap} and {@link attributeMap} currying functions
 * and consumed automatically during template parsing.
 */
class TemplateElement extends FASTElement {
    /**
     * The name of the custom element this template will be applied to
     */
    @attr
    public name?: string;

    /**
     * ObserverMap instance for caching binding paths
     */
    private observerMap?: ObserverMap;

    /**
     * AttributeMap instance for defining @attr properties
     */
    private attributeMap?: AttributeMap;

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

    connectedCallback(): void {
        super.connectedCallback();
        const name = this.name;

        if (typeof name !== "string") {
            return;
        }

        this.schema = new Schema(name);

        FASTElementDefinition.register(name).then(async value => {
            TemplateElement.lifecycleCallbacks.elementDidRegister?.(name);

            const pendingObserver = pendingObserverMaps.get(name);
            const pendingAttribute = pendingAttributeMaps.get(name);

            // Use the explicitly provided schema or fall back to the
            // template-parsed schema (populated below during parsing).
            const schema = pendingObserver?.schema ?? this.schema!;

            if (pendingObserver) {
                this.observerMap = new ObserverMap(
                    value.prototype,
                    schema,
                    pendingObserver.config,
                );
            }

            const registeredFastElement: FASTElementDefinition | undefined =
                fastElementRegistry.getByType(value);

            if (pendingAttribute) {
                const attrSchema = pendingAttribute.schema ?? this.schema!;
                this.attributeMap = new AttributeMap(
                    value.prototype,
                    attrSchema,
                    registeredFastElement,
                    pendingAttribute.config,
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
