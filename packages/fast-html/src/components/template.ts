import {
    children,
    elements,
    FASTElement,
    FASTElementDefinition,
    fastElementRegistry,
    HydratableElementController,
    type HydrationControllerCallbacks,
    ref,
    repeat,
    slotted,
    type TemplateLifecycleCallbacks,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import "@microsoft/fast-element/install-hydratable-view-templates.js";
import { ObserverMap } from "./observer-map.js";
import { Schema } from "./schema.js";
import {
    type AttributeDirective,
    bindingResolver,
    type ChainedExpression,
    contextPrefixDot,
    type DataBindingBehaviorConfig,
    getBooleanBinding,
    getExpressionChain,
    getNextBehavior,
    getRootPropertyName,
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
 * Values for the observerMap element option.
 */
export const ObserverMapOption = {
    all: "all",
} as const;

/**
 * Type for the observerMap element option.
 */
export type ObserverMapOption =
    (typeof ObserverMapOption)[keyof typeof ObserverMapOption];

/**
 * Element options the TemplateElement will use to update the registered element
 */
export interface ElementOptions {
    observerMap?: ObserverMapOption;
}

/**
 * A dictionary of element options the TemplateElement will use to update the registered element
 */
export interface ElementOptionsDictionary<ElementOptionsType = ElementOptions> {
    [key: string]: ElementOptionsType;
}

/**
 * Lifecycle callbacks for template and hydration events.
 * Combines template lifecycle callbacks with hydration callbacks and adds template-processing events.
 */
export interface HydrationLifecycleCallbacks
    extends HydrationControllerCallbacks,
        TemplateLifecycleCallbacks {
    /**
     * Called after the JS class definition has been registered
     */
    elementDidRegister?(name: string): void;

    /**
     * Called before the template has been evaluated and assigned
     */
    templateWillUpdate?(name: string): void;
}

/**
 * The <f-template> custom element that will provide view logic to the element
 */
class TemplateElement extends FASTElement {
    /**
     * A dictionary of custom element options
     */
    public static elementOptions: ElementOptionsDictionary = {};

    /**
     * Default element options
     */
    private static defaultElementOptions: ElementOptions = {};

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

        // Pass the hydration-specific callbacks to HydratableElementController
        HydratableElementController.config({ ...callbacks });

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
            };
        }

        TemplateElement.elementOptions = result;

        HydratableElementController.install();

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
        this.processMultipleTemplates();
    }

    /**
     * Processes multiple element templates defined within a single nameless <f-template>.
     *
     * Each direct <template name="..."> child is treated as either an element template
     * (when the name matches a registered FASTElement) or a shared partial. All named
     * templates are registered in a partial registry so they can be referenced by other
     * templates via empty <template name="..."></template> markers. The content of a
     * referenced partial is inlined before the template is compiled.
     */
    private processMultipleTemplates(): void {
        const templateChildren = Array.from(this.children).filter(
            (child): child is HTMLTemplateElement => child.tagName === "TEMPLATE",
        );

        // Build the partial registry: name → raw innerHTML of that template.
        // Every named template is a potential partial regardless of whether it maps
        // to a custom element.
        const partialRegistry = new Map<string, string>();
        const hostAttrRegistry = new Map<string, string>();
        for (const tmpl of templateChildren) {
            const tmplName = tmpl.getAttribute("name");
            if (tmplName) {
                partialRegistry.set(tmplName, tmpl.innerHTML);
                const hostAttrs = Array.from(tmpl.attributes)
                    .filter(attr => attr.name !== "name")
                    .map(attr => ` ${attr.name}="${attr.value}"`)
                    .join("");
                if (hostAttrs) {
                    hostAttrRegistry.set(tmplName, hostAttrs);
                }
            }
        }

        // Attempt to register each named template as an element template.
        // For templates that never map to a registered FASTElement the promise
        // will not resolve, which is acceptable — they remain accessible as
        // shared partials via the ViewTemplate partial registry.
        for (const [tmplName] of partialRegistry) {
            const schema = new Schema(tmplName);
            let localObserverMap: ObserverMap | undefined;

            FASTElementDefinition.registerAsync(tmplName).then(async value => {
                TemplateElement.lifecycleCallbacks.elementDidRegister?.(tmplName);

                if (!TemplateElement.elementOptions?.[tmplName]) {
                    TemplateElement.setOptions(tmplName);
                }

                if (TemplateElement.elementOptions[tmplName]?.observerMap === "all") {
                    localObserverMap = new ObserverMap(value.prototype, schema);
                }

                const registeredFastElement = fastElementRegistry.getByType(value);

                if (registeredFastElement) {
                    TemplateElement.lifecycleCallbacks.templateWillUpdate?.(tmplName);

                    // Resolve partial references: replace empty <template name="..."></template>
                    // markers inside this template's content with the referenced partial's HTML.
                    const rawContent = partialRegistry.get(tmplName)!;
                    const resolvedContent = TemplateElement.resolvePartialReferences(
                        rawContent,
                        partialRegistry,
                    );

                    // Wrap in a <template> element so the Compiler's auto-unwrap logic
                    // (fec.tagName === "TEMPLATE") treats it as a proper element template,
                    // matching the behaviour of the single-template <f-template name="..."> path.
                    // Any host-binding attributes on the <template name="..."> element are
                    // preserved so event/property/boolean bindings on the host are applied.
                    const hostAttrs = hostAttrRegistry.get(tmplName) ?? "";
                    const wrappedHTML = `<template${hostAttrs}>${resolvedContent}</template>`;
                    const innerHTML = transformInnerHTML(wrappedHTML);

                    const { strings, values } = await this.resolveStringsAndValues(
                        null,
                        innerHTML,
                        false,
                        null,
                        0,
                        schema,
                        localObserverMap,
                    );

                    localObserverMap?.defineProperties();

                    (registeredFastElement as any).lifecycleCallbacks = {
                        templateDidUpdate:
                            TemplateElement.lifecycleCallbacks.templateDidUpdate,
                        elementDidDefine:
                            TemplateElement.lifecycleCallbacks.elementDidDefine,
                    };

                    const viewTemplate = this.resolveTemplateOrBehavior(strings, values);

                    // Register the created ViewTemplate as a named partial so it can
                    // be retrieved programmatically via ViewTemplate.getPartial(name).
                    ViewTemplate.definePartial(tmplName, viewTemplate);

                    registeredFastElement.template = viewTemplate;
                }
            });
        }
    }

    /**
     * Resolves template partial references within an HTML string.
     *
     * An empty <template name="partial-name"></template> element (i.e. one whose
     * content is absent or purely whitespace) is treated as a reference to the
     * named partial in the registry and is replaced with that partial's HTML.
     * Resolution is applied recursively to support partials that themselves
     * reference other partials, up to a maximum depth of 10.
     *
     * @param html - The HTML string to process.
     * @param partialRegistry - Map of partial name → raw HTML content.
     * @param depth - Current recursion depth (used internally to prevent infinite loops).
     * @returns The HTML string with all partial references replaced by their content.
     */
    private static resolvePartialReferences(
        html: string,
        partialRegistry: Map<string, string>,
        depth: number = 0,
    ): string {
        if (depth >= 10) {
            return html;
        }

        let result = html;
        let changed = false;

        for (const [name, content] of partialRegistry) {
            // Escape special regex characters in the partial name.
            const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            // Match only empty template elements (no content or whitespace-only).
            // Templates with actual HTML content are definitions, not references.
            const pattern = new RegExp(
                `<template\\s+name="${escapedName}"\\s*>\\s*</template>`,
                "g",
            );

            const newResult = result.replace(pattern, content);

            if (newResult !== result) {
                changed = true;
                result = newResult;
            }
        }

        // If any references were resolved, recurse to expand newly-introduced references.
        if (changed) {
            return TemplateElement.resolvePartialReferences(
                result,
                partialRegistry,
                depth + 1,
            );
        }

        return result;
    }

    /**
     * Resolve strings and values from an innerHTML string
     * @param innerHTML - The innerHTML.
     * @param self - Indicates that this should refer to itself instead of a property when creating bindings.
     * @param observerMap - ObserverMap instance for caching binding paths (optional).
     */
    private async resolveStringsAndValues(
        rootPropertyName: string | null,
        innerHTML: string,
        self: boolean = false,
        parentContext: string | null,
        level: number,
        schema: Schema,
        observerMap?: ObserverMap,
    ): Promise<ResolvedStringsAndValues> {
        const strings: any[] = [];
        const values: any[] = []; // these can be bindings, directives, etc.
        await this.resolveInnerHTML(
            rootPropertyName,
            innerHTML,
            strings,
            values,
            self,
            parentContext,
            level,
            schema,
            observerMap,
        );

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
     * @param observerMap - ObserverMap instance for caching binding paths (optional).
     */
    private async resolveTemplateDirective(
        rootPropertyName: string | null,
        behaviorConfig: TemplateDirectiveBehaviorConfig,
        externalValues: Array<any>,
        innerHTML: string,
        self: boolean = false,
        parentContext: string | null,
        level: number,
        schema: Schema,
        observerMap?: ObserverMap,
    ): Promise<void> {
        switch (behaviorConfig.name) {
            case "when": {
                const expressionChain = getExpressionChain(behaviorConfig.value);

                const whenLogic = getBooleanBinding(
                    rootPropertyName,
                    expressionChain as ChainedExpression,
                    parentContext,
                    level,
                    schema,
                );

                const { strings, values } = await this.resolveStringsAndValues(
                    rootPropertyName,
                    innerHTML.slice(
                        behaviorConfig.openingTagEndIndex,
                        behaviorConfig.closingTagStartIndex,
                    ),
                    self,
                    parentContext,
                    level,
                    schema,
                    observerMap,
                );

                externalValues.push(
                    when(whenLogic, this.resolveTemplateOrBehavior(strings, values)),
                );

                break;
            }
            case "repeat": {
                const valueAttr = behaviorConfig.value.split(" "); // syntax {{x in y}}
                const updatedLevel = level + 1;

                rootPropertyName = getRootPropertyName(
                    rootPropertyName,
                    valueAttr[2],
                    parentContext,
                    behaviorConfig.name,
                );
                const binding = bindingResolver(
                    null,
                    rootPropertyName,
                    valueAttr[2],
                    parentContext,
                    behaviorConfig.name,
                    schema,
                    valueAttr[0],
                    level,
                );

                const { strings, values } = await this.resolveStringsAndValues(
                    rootPropertyName,
                    innerHTML.slice(
                        behaviorConfig.openingTagEndIndex,
                        behaviorConfig.closingTagStartIndex,
                    ),
                    true,
                    valueAttr[0],
                    updatedLevel,
                    schema,
                    observerMap,
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
     * Resolver of a data binding
     * @param innerHTML - The innerHTML.
     * @param strings - The strings array.
     * @param values - The interpreted values.
     * @param self - Indicates that this should refer to itself instead of a property when creating bindings.
     * @param behaviorConfig - The binding behavior configuration object.
     * @param observerMap - ObserverMap instance for caching binding paths (optional).
     */
    private async resolveDataBinding(
        rootPropertyName: string | null,
        innerHTML: string,
        strings: Array<string>,
        values: Array<any>,
        self: boolean = false,
        behaviorConfig: DataBindingBehaviorConfig,
        parentContext: string | null,
        level: number,
        schema: Schema,
        observerMap?: ObserverMap,
    ): Promise<void> {
        switch (behaviorConfig.subtype) {
            case "content": {
                strings.push(innerHTML.slice(0, behaviorConfig.openingStartIndex));
                const type = "access";
                const propName = innerHTML.slice(
                    behaviorConfig.openingEndIndex,
                    behaviorConfig.closingStartIndex,
                );
                rootPropertyName = getRootPropertyName(
                    rootPropertyName,
                    propName,
                    parentContext,
                    type,
                );
                const binding = bindingResolver(
                    strings.join(""),
                    rootPropertyName,
                    propName,
                    parentContext,
                    type,
                    schema,
                    parentContext,
                    level,
                );
                const contentBinding = (x: any, c: any) => binding(x, c);
                values.push(contentBinding);
                await this.resolveInnerHTML(
                    rootPropertyName,
                    innerHTML.slice(behaviorConfig.closingEndIndex, innerHTML.length),
                    strings,
                    values,
                    self,
                    parentContext,
                    level,
                    schema,
                    observerMap,
                );

                break;
            }
            case "attribute": {
                strings.push(innerHTML.slice(0, behaviorConfig.openingStartIndex));
                let attributeBinding;

                switch (behaviorConfig.aspect) {
                    case "@": {
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
                            parentContext,
                            type,
                        );
                        const arg = bindingHTML.slice(
                            openingParenthesis + 1,
                            closingParenthesis,
                        );
                        const binding = bindingResolver(
                            strings.join(""),
                            rootPropertyName,
                            propName,
                            parentContext,
                            type,
                            schema,
                            parentContext,
                            level,
                        );
                        const isContextPath = propName.startsWith(contextPrefixDot);
                        const getOwner = isContextPath
                            ? (_x: any, c: any) => {
                                  const ownerPath = propName.split(".").slice(1, -1);
                                  return ownerPath.reduce(
                                      (prev: any, item: string) => prev?.[item],
                                      c,
                                  );
                              }
                            : (x: any, _c: any) => x;
                        attributeBinding = (x: any, c: any) =>
                            binding(x, c).bind(getOwner(x, c))(
                                ...(arg === "e" ? [c.event] : []),
                                ...(arg !== "e" && arg !== ""
                                    ? [
                                          bindingResolver(
                                              strings.join(""),
                                              rootPropertyName,
                                              arg,
                                              parentContext,
                                              type,
                                              schema,
                                              parentContext,
                                              level,
                                          )(x, c),
                                      ]
                                    : []),
                            );

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
                                parentContext,
                                level,
                                schema,
                            );
                        } else {
                            const propName = innerHTML.slice(
                                behaviorConfig.openingEndIndex,
                                behaviorConfig.closingStartIndex,
                            );
                            const type = "access";

                            rootPropertyName = getRootPropertyName(
                                rootPropertyName,
                                propName,
                                parentContext,
                                type,
                            );

                            const binding = bindingResolver(
                                strings.join(""),
                                rootPropertyName,
                                propName,
                                parentContext,
                                type,
                                schema,
                                parentContext,
                                level,
                            );
                            attributeBinding = (x: any, c: any) => binding(x, c);
                        }

                        break;
                    }
                    default: {
                        const propName = innerHTML.slice(
                            behaviorConfig.openingEndIndex,
                            behaviorConfig.closingStartIndex,
                        );
                        const type = "access";

                        rootPropertyName = getRootPropertyName(
                            rootPropertyName,
                            propName,
                            parentContext,
                            type,
                        );

                        const binding = bindingResolver(
                            strings.join(""),
                            rootPropertyName,
                            propName,
                            parentContext,
                            type,
                            schema,
                            parentContext,
                            level,
                        );
                        attributeBinding = (x: any, c: any) => binding(x, c);
                    }
                }

                values.push(attributeBinding);

                await this.resolveInnerHTML(
                    rootPropertyName,
                    innerHTML.slice(behaviorConfig.closingEndIndex, innerHTML.length),
                    strings,
                    values,
                    self,
                    parentContext,
                    level,
                    schema,
                    observerMap,
                );

                break;
            }
            case "attributeDirective": {
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
                await this.resolveAttributeDirective(
                    behaviorConfig.name,
                    propName,
                    values,
                );
                await this.resolveInnerHTML(
                    rootPropertyName,
                    innerHTML.slice(behaviorConfig.closingEndIndex + 1, innerHTML.length),
                    strings,
                    values,
                    self,
                    parentContext,
                    level,
                    schema,
                    observerMap,
                );

                break;
            }
        }
    }

    /**
     * Resolver of the innerHTML string
     * @param innerHTML - The innerHTML.
     * @param strings - The strings array.
     * @param values - The interpreted values.
     * @param self - Indicates that this should refer to itself instead of a property when creating bindings.
     * @param observerMap - ObserverMap instance for caching binding paths (optional).
     */
    private async resolveInnerHTML(
        rootPropertyName: string | null,
        innerHTML: string,
        strings: Array<string>,
        values: Array<any>,
        self: boolean = false,
        parentContext: string | null,
        level: number,
        schema: Schema,
        observerMap?: ObserverMap,
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
                        self,
                        behaviorConfig,
                        parentContext,
                        level,
                        schema,
                        observerMap,
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
                        self,
                        parentContext,
                        level,
                        schema,
                        observerMap,
                    );

                    await this.resolveInnerHTML(
                        rootPropertyName,
                        innerHTML.slice(
                            behaviorConfig.closingTagEndIndex,
                            innerHTML.length,
                        ),
                        strings,
                        values,
                        self,
                        parentContext,
                        level,
                        schema,
                        observerMap,
                    );

                    break;
                }
            }
        }
    }
}

export { TemplateElement };
