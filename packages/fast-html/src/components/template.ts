import {
    attr,
    children,
    ElementController,
    elements,
    FAST,
    FASTElement,
    FASTElementDefinition,
    fastElementRegistry,
    ref,
    repeat,
    slotted,
    type TemplateLifecycleCallbacks,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import "@microsoft/fast-element/install-hydratable-view-templates.js";
import { Message } from "../interfaces.js";
import { AttributeMap } from "./attribute-map.js";
import { ObserverMap } from "./observer-map.js";
import { Schema } from "./schema.js";
import {
    type AttributeDirective,
    type AttributeDirectiveBindingBehaviorConfig,
    bindingResolver,
    type ChainedExpression,
    contextPrefixDot,
    type DataBindingBehaviorConfig,
    eventArgAccessor,
    getBooleanBinding,
    getExpressionChain,
    getNextBehavior,
    getRootPropertyName,
    parseEventArgs,
    type TemplateDirectiveBehaviorConfig,
    transformInnerHTML,
} from "./utilities.js";

/**
 * The return type for {@link TemplateElement.resolveStringsAndValues}.
 */
interface ResolvedStringsAndValues {
    strings: Array<string>;
    values: Array<any>;
}

/**
 * Encapsulates the stable context fields that flow through the recursive
 * template resolution pipeline. Keeps method signatures lean and makes it
 * easy to add new context without touching every call site.
 *
 * `rootPropertyName` is intentionally **excluded** because it is
 * selectively mutated per branch and must not leak across siblings.
 */
interface TemplateResolutionContext {
    self: boolean;
    parentContext: string | null;
    level: number;
    schema: Schema;
    observerMap?: ObserverMap;
}

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
 * The <f-template> custom element that will provide view logic to the element
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
     * Whether the template contains deprecated "e" event argument usage.
     * Set during template processing; checked after evaluation to emit a
     * single warning per template.
     */
    // TODO: remove per https://github.com/microsoft/fast/issues/7314
    private _hasDeprecatedEventSyntax = false;

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

            if (isMapOptionEnabled(TemplateElement.elementOptions[name]?.observerMap)) {
                const observerMapOption =
                    TemplateElement.elementOptions[name]?.observerMap;
                const observerMapConfig =
                    typeof observerMapOption === "object" && observerMapOption !== null
                        ? observerMapOption
                        : undefined;

                this.observerMap = new ObserverMap(
                    value.prototype,
                    this.schema as Schema,
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
                    this.schema as Schema,
                    registeredFastElement,
                    mapConfig,
                );
            }

            const templates = this.getElementsByTagName("template");

            if (templates.length === 1) {
                // Callback: Before template has been evaluated and assigned
                TemplateElement.lifecycleCallbacks.templateWillUpdate?.(name);

                const innerHTML = transformInnerHTML(this.innerHTML);

                // Cache paths during template processing (pass undefined if observerMap is not available)
                const { strings, values } = await this.resolveStringsAndValues(
                    null,
                    innerHTML,
                    {
                        self: false,
                        parentContext: null,
                        level: 0,
                        schema: this.schema as Schema,
                        observerMap: this.observerMap,
                    },
                );

                if (this._hasDeprecatedEventSyntax) {
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
                    registeredFastElement.template = this.resolveTemplateOrBehavior(
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

    /**
     * Resolve strings and values from an innerHTML string
     * @param rootPropertyName - The root property name for schema registration.
     * @param innerHTML - The innerHTML.
     * @param ctx - The template resolution context.
     */
    private async resolveStringsAndValues(
        rootPropertyName: string | null,
        innerHTML: string,
        ctx: TemplateResolutionContext,
    ): Promise<ResolvedStringsAndValues> {
        const strings: any[] = [];
        const values: any[] = []; // these can be bindings, directives, etc.
        await this.resolveInnerHTML(rootPropertyName, innerHTML, strings, values, ctx);

        (strings as any).raw = strings.map(value => String.raw({ raw: value }));

        return {
            strings,
            values,
        };
    }

    /**
     * Resolve a template or behavior
     * @param strings - The strings array.
     * @param values - The interpreted values.
     */
    private resolveTemplateOrBehavior(
        strings: Array<string>,
        values: Array<any>,
    ): ViewTemplate<any, any> {
        return ViewTemplate.create(strings, values);
    }

    /**
     * Resolve a template directive
     * @param behaviorConfig - The directive behavior configuration object.
     * @param externalValues - The interpreted values from the parent.
     * @param innerHTML - The innerHTML.
     * @param self - Indicates that this should refer to itself instead of a property when creating bindings.
    /**
     * Resolve a template directive (when/repeat).
     * @param rootPropertyName - The root property name for schema registration.
     * @param behaviorConfig - The directive behavior configuration object.
     * @param externalValues - The interpreted values from the parent.
     * @param innerHTML - The innerHTML.
     * @param ctx - The template resolution context.
     */
    private async resolveTemplateDirective(
        rootPropertyName: string | null,
        behaviorConfig: TemplateDirectiveBehaviorConfig,
        externalValues: Array<any>,
        innerHTML: string,
        ctx: TemplateResolutionContext,
    ): Promise<void> {
        switch (behaviorConfig.name) {
            case "when": {
                const expressionChain = getExpressionChain(behaviorConfig.value);

                const whenLogic = getBooleanBinding(
                    rootPropertyName,
                    expressionChain as ChainedExpression,
                    ctx.parentContext,
                    ctx.level,
                    ctx.schema,
                );

                const { strings, values } = await this.resolveStringsAndValues(
                    rootPropertyName,
                    innerHTML.slice(
                        behaviorConfig.openingTagEndIndex,
                        behaviorConfig.closingTagStartIndex,
                    ),
                    ctx,
                );

                externalValues.push(
                    when(whenLogic, this.resolveTemplateOrBehavior(strings, values)),
                );

                break;
            }
            case "repeat": {
                const valueAttr = behaviorConfig.value.split(" "); // syntax {{x in y}}
                const updatedLevel = ctx.level + 1;

                rootPropertyName = getRootPropertyName(
                    rootPropertyName,
                    valueAttr[2],
                    ctx.parentContext,
                    behaviorConfig.name,
                );
                const binding = bindingResolver(
                    null,
                    rootPropertyName,
                    valueAttr[2],
                    ctx.parentContext,
                    behaviorConfig.name,
                    ctx.schema,
                    valueAttr[0],
                    ctx.level,
                );

                const repeatCtx: TemplateResolutionContext = {
                    self: true,
                    parentContext: valueAttr[0],
                    level: updatedLevel,
                    schema: ctx.schema,
                    observerMap: ctx.observerMap,
                };

                const { strings, values } = await this.resolveStringsAndValues(
                    rootPropertyName,
                    innerHTML.slice(
                        behaviorConfig.openingTagEndIndex,
                        behaviorConfig.closingTagStartIndex,
                    ),
                    repeatCtx,
                );

                externalValues.push(
                    repeat(
                        (x, c) => binding(x, c),
                        this.resolveTemplateOrBehavior(strings, values),
                    ),
                );

                break;
            }
        }
    }

    /**
     * Resolve a template directive
     * @param name - The name of the directive.
     * @param propName - The property name to pass to the directive.
     * @param externalValues - The interpreted values from the parent.
     */
    private async resolveAttributeDirective(
        name: AttributeDirective,
        propName: string,
        externalValues: Array<any>,
    ) {
        switch (name) {
            case "children": {
                externalValues.push(children(propName));

                break;
            }
            case "slotted": {
                const parts = propName.trim().split(" filter ");
                const slottedOption = {
                    property: parts[0],
                };

                if (parts[1]) {
                    if (parts[1].startsWith("elements(")) {
                        let params = parts[1].replace("elements(", "");
                        params = params.substring(0, params.lastIndexOf(")"));
                        Object.assign(slottedOption, {
                            filter: elements(params || undefined),
                        });
                    }
                }

                externalValues.push(slotted(slottedOption));

                break;
            }
            case "ref": {
                externalValues.push(ref(propName));

                break;
            }
        }
    }

    /**
     * Resolve an access binding — shared by content bindings, boolean-attribute
     * fallback, and default attribute bindings.
     * @returns An object with the resolved binding function and the updated rootPropertyName.
     */
    private resolveAccessBinding(
        rootPropertyName: string | null,
        propName: string,
        previousStrings: string,
        ctx: TemplateResolutionContext,
    ): {
        binding: (x: any, c: any) => any;
        rootPropertyName: string | null;
    } {
        rootPropertyName = getRootPropertyName(
            rootPropertyName,
            propName,
            ctx.parentContext,
            "access",
        );
        const resolved = bindingResolver(
            previousStrings,
            rootPropertyName,
            propName,
            ctx.parentContext,
            "access",
            ctx.schema,
            ctx.parentContext,
            ctx.level,
        );
        return {
            binding: (x: any, c: any) => resolved(x, c),
            rootPropertyName,
        };
    }

    /**
     * Resolve an event binding (the "@" aspect).
     * @returns An object with the event binding function and the updated rootPropertyName.
     */
    private resolveEventBinding(
        rootPropertyName: string | null,
        innerHTML: string,
        behaviorConfig: DataBindingBehaviorConfig,
        strings: Array<string>,
        ctx: TemplateResolutionContext,
    ): {
        binding: (x: any, c: any) => any;
        rootPropertyName: string | null;
    } {
        const bindingHTML = innerHTML.slice(
            behaviorConfig.openingEndIndex,
            behaviorConfig.closingStartIndex,
        );
        const openingParenthesis = bindingHTML.indexOf("(");
        const closingParenthesis = bindingHTML.indexOf(")");
        const propName = innerHTML.slice(
            behaviorConfig.openingEndIndex,
            behaviorConfig.closingStartIndex -
                (closingParenthesis - openingParenthesis) -
                1,
        );
        const type = "event";
        rootPropertyName = getRootPropertyName(
            rootPropertyName,
            propName,
            ctx.parentContext,
            type,
        );
        const argsString = bindingHTML.slice(openingParenthesis + 1, closingParenthesis);
        const resolved = bindingResolver(
            strings.join(""),
            rootPropertyName,
            propName,
            ctx.parentContext,
            type,
            ctx.schema,
            ctx.parentContext,
            ctx.level,
        );
        const isContextPath = propName.startsWith(contextPrefixDot);
        const getOwner = isContextPath
            ? (_x: any, c: any) => {
                  const ownerPath = propName.split(".").slice(1, -1);
                  return ownerPath.reduce((prev: any, item: string) => prev?.[item], c);
              }
            : (x: any, _c: any) => x;

        const parsedArgs = parseEventArgs(argsString);

        if (parsedArgs.some(a => a.type === "deprecated-event")) {
            this._hasDeprecatedEventSyntax = true;
        }

        const argResolvers = parsedArgs.map((parsedArg): ((x: any, c: any) => any) => {
            switch (parsedArg.type) {
                case "event":
                case "deprecated-event":
                    return (_x, c) => c.event;
                case "context":
                    return (_x, c) => c;
                case "binding":
                    return bindingResolver(
                        strings.join(""),
                        rootPropertyName,
                        parsedArg.rawArg!,
                        ctx.parentContext,
                        type,
                        ctx.schema,
                        ctx.parentContext,
                        ctx.level,
                    );
            }
        });

        return {
            binding: (x: any, c: any) =>
                resolved(x, c).bind(getOwner(x, c))(
                    ...argResolvers.map(resolve => resolve(x, c)),
                ),
            rootPropertyName,
        };
    }

    /**
     * Resolve a content data binding (`{{expression}}` in text content).
     */
    private async resolveContentBinding(
        rootPropertyName: string | null,
        innerHTML: string,
        strings: Array<string>,
        values: Array<any>,
        behaviorConfig: DataBindingBehaviorConfig,
        ctx: TemplateResolutionContext,
    ): Promise<void> {
        strings.push(innerHTML.slice(0, behaviorConfig.openingStartIndex));
        const propName = innerHTML.slice(
            behaviorConfig.openingEndIndex,
            behaviorConfig.closingStartIndex,
        );
        const result = this.resolveAccessBinding(
            rootPropertyName,
            propName,
            strings.join(""),
            ctx,
        );
        rootPropertyName = result.rootPropertyName;
        values.push(result.binding);
        await this.resolveInnerHTML(
            rootPropertyName,
            innerHTML.slice(behaviorConfig.closingEndIndex, innerHTML.length),
            strings,
            values,
            ctx,
        );
    }

    /**
     * Resolve an attribute data binding (`{{expression}}` in an HTML attribute).
     * Dispatches to event, expression, or access binding handlers based on aspect.
     */
    private async resolveAttributeBinding(
        rootPropertyName: string | null,
        innerHTML: string,
        strings: Array<string>,
        values: Array<any>,
        behaviorConfig: DataBindingBehaviorConfig,
        ctx: TemplateResolutionContext,
    ): Promise<void> {
        strings.push(innerHTML.slice(0, behaviorConfig.openingStartIndex));
        let attributeBinding;

        const aspect =
            behaviorConfig.subtype === "attribute" ? behaviorConfig.aspect : null;

        switch (aspect) {
            case "@": {
                const result = this.resolveEventBinding(
                    rootPropertyName,
                    innerHTML,
                    behaviorConfig,
                    strings,
                    ctx,
                );
                attributeBinding = result.binding;
                rootPropertyName = result.rootPropertyName;
                break;
            }
            case "?": {
                const expression = innerHTML.slice(
                    behaviorConfig.openingEndIndex,
                    behaviorConfig.closingStartIndex,
                );
                const expressionChain = getExpressionChain(expression);

                if (expressionChain?.expression.operator) {
                    attributeBinding = getBooleanBinding(
                        rootPropertyName,
                        expressionChain as ChainedExpression,
                        ctx.parentContext,
                        ctx.level,
                        ctx.schema,
                    );
                } else {
                    const propName = innerHTML.slice(
                        behaviorConfig.openingEndIndex,
                        behaviorConfig.closingStartIndex,
                    );
                    const result = this.resolveAccessBinding(
                        rootPropertyName,
                        propName,
                        strings.join(""),
                        ctx,
                    );
                    attributeBinding = result.binding;
                    rootPropertyName = result.rootPropertyName;
                }

                break;
            }
            default: {
                const propName = innerHTML.slice(
                    behaviorConfig.openingEndIndex,
                    behaviorConfig.closingStartIndex,
                );
                const result = this.resolveAccessBinding(
                    rootPropertyName,
                    propName,
                    strings.join(""),
                    ctx,
                );
                attributeBinding = result.binding;
                rootPropertyName = result.rootPropertyName;
            }
        }

        values.push(attributeBinding);

        await this.resolveInnerHTML(
            rootPropertyName,
            innerHTML.slice(behaviorConfig.closingEndIndex, innerHTML.length),
            strings,
            values,
            ctx,
        );
    }

    /**
     * Resolve an attribute directive binding (`f-children`, `f-slotted`, `f-ref`).
     */
    private async resolveAttributeDirectiveBinding(
        rootPropertyName: string | null,
        innerHTML: string,
        strings: Array<string>,
        values: Array<any>,
        behaviorConfig: AttributeDirectiveBindingBehaviorConfig,
        ctx: TemplateResolutionContext,
    ): Promise<void> {
        strings.push(
            innerHTML.slice(
                0,
                behaviorConfig.openingStartIndex - behaviorConfig.name.length - 4,
            ),
        );
        const propName = innerHTML.slice(
            behaviorConfig.openingEndIndex,
            behaviorConfig.closingStartIndex,
        );
        await this.resolveAttributeDirective(behaviorConfig.name, propName, values);
        await this.resolveInnerHTML(
            rootPropertyName,
            innerHTML.slice(behaviorConfig.closingEndIndex + 1, innerHTML.length),
            strings,
            values,
            ctx,
        );
    }

    /**
     * Dispatcher for data binding resolution. Routes to the appropriate handler
     * based on the binding subtype.
     */
    private async resolveDataBinding(
        rootPropertyName: string | null,
        innerHTML: string,
        strings: Array<string>,
        values: Array<any>,
        behaviorConfig: DataBindingBehaviorConfig,
        ctx: TemplateResolutionContext,
    ): Promise<void> {
        switch (behaviorConfig.subtype) {
            case "content":
                return this.resolveContentBinding(
                    rootPropertyName,
                    innerHTML,
                    strings,
                    values,
                    behaviorConfig,
                    ctx,
                );
            case "attribute":
                return this.resolveAttributeBinding(
                    rootPropertyName,
                    innerHTML,
                    strings,
                    values,
                    behaviorConfig,
                    ctx,
                );
            case "attributeDirective":
                return this.resolveAttributeDirectiveBinding(
                    rootPropertyName,
                    innerHTML,
                    strings,
                    values,
                    behaviorConfig,
                    ctx,
                );
        }
    }

    /**
     * Resolver of the innerHTML string. Finds the next binding or directive
     * in the HTML and dispatches to the appropriate handler.
     * @param rootPropertyName - The root property name for schema registration.
     * @param innerHTML - The innerHTML to parse.
     * @param strings - The strings array (accumulates literal HTML segments).
     * @param values - The values array (accumulates binding functions and directives).
     * @param ctx - The template resolution context.
     */
    private async resolveInnerHTML(
        rootPropertyName: string | null,
        innerHTML: string,
        strings: Array<string>,
        values: Array<any>,
        ctx: TemplateResolutionContext,
    ): Promise<void> {
        const behaviorConfig = getNextBehavior(innerHTML);

        if (behaviorConfig === null) {
            strings.push(innerHTML);
        } else {
            switch (behaviorConfig.type) {
                case "dataBinding": {
                    await this.resolveDataBinding(
                        rootPropertyName,
                        innerHTML,
                        strings,
                        values,
                        behaviorConfig,
                        ctx,
                    );

                    break;
                }
                case "templateDirective": {
                    strings.push(innerHTML.slice(0, behaviorConfig.openingTagStartIndex));
                    await this.resolveTemplateDirective(
                        rootPropertyName,
                        behaviorConfig,
                        values,
                        innerHTML,
                        ctx,
                    );

                    await this.resolveInnerHTML(
                        rootPropertyName,
                        innerHTML.slice(
                            behaviorConfig.closingTagEndIndex,
                            innerHTML.length,
                        ),
                        strings,
                        values,
                        ctx,
                    );

                    break;
                }
            }
        }
    }
}

export { TemplateElement };
