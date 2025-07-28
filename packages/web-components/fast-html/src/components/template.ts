import {
    attr,
    elements,
    FAST,
    FASTElement,
    FASTElementDefinition,
    fastElementRegistry,
    HydratableElementController,
    ShadowRootOptions,
    ViewTemplate,
} from "@microsoft/fast-element";
import "@microsoft/fast-element/install-hydratable-view-templates.js";
import { Message } from "../interfaces.js";
import {
    AttributeDirective,
    bindingResolver,
    ChainedExpression,
    DataBindingBehaviorConfig,
    getAllPartials,
    getExpressionChain,
    getNextBehavior,
    resolveWhen,
    TemplateDirectiveBehaviorConfig,
    transformInnerHTML,
} from "./utilities.js";
import { ObserverMap } from "./observer-map.js";

interface ResolvedStringsAndValues {
    strings: Array<string>;
    values: Array<any>;
}

export type ObserverMapOption = "all";

export interface ElementOptions {
    shadowOptions?: ShadowRootOptions | undefined;
    observerMap?: ObserverMapOption | undefined;
}

/**
 * A dictionary of element options the TemplateElement will use to update the registered element
 */
export interface ElementOptionsDictionary<ElementOptionsType = ElementOptions> {
    [key: string]: ElementOptionsType;
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

    private partials: { [key: string]: ViewTemplate } = {};

    /**
     * ObserverMap instance for caching binding paths
     */
    private observerMap?: ObserverMap;

    private static defaultElementOptions: ElementOptions = {
        shadowOptions: {
            mode: "open",
        },
    };

    public static options(elementOptions: ElementOptionsDictionary = {}) {
        const result: ElementOptionsDictionary = {};

        for (const key in elementOptions) {
            const value = elementOptions[key];
            result[key] = {
                shadowOptions:
                    value.shadowOptions ??
                    TemplateElement.defaultElementOptions.shadowOptions,
                observerMap: value.observerMap,
            };
        }

        this.elementOptions = result;

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

        if (this.name) {
            FASTElementDefinition.registerAsync(this.name).then(async value => {
                if (this.name) {
                    if (!TemplateElement.elementOptions?.[this.name]) {
                        TemplateElement.setOptions(this.name);
                    }

                    if (
                        TemplateElement.elementOptions[this.name]?.observerMap === "all"
                    ) {
                        this.observerMap = new ObserverMap(value.prototype);
                    }
                }

                const registeredFastElement: FASTElementDefinition | undefined =
                    fastElementRegistry.getByType(value);
                const template = this.getElementsByTagName("template").item(0);

                if (template) {
                    const innerHTML = await transformInnerHTML(this.innerHTML);

                    await this.resolveAllPartials(innerHTML);

                    // Cache paths during template processing (pass undefined if observerMap is not available)
                    const { strings, values } = await this.resolveStringsAndValues(
                        innerHTML,
                        false,
                        null,
                        this.observerMap
                    );

                    // Define the root properties cached in the observer map as observable (only if observerMap exists)
                    if (this.observerMap) {
                        for (const rootProperty of this.observerMap.getCachedRootProperties()) {
                            this.observerMap.defineProperty(rootProperty);
                        }
                    }

                    if (registeredFastElement) {
                        // all new elements will get the updated template
                        registeredFastElement.template = this.resolveTemplateOrBehavior(
                            strings,
                            values
                        );
                        // set shadow options as defined by the f-template
                        registeredFastElement.shadowOptions =
                            TemplateElement.elementOptions[
                                this.name as string
                            ]?.shadowOptions;
                    }
                } else {
                    throw FAST.error(Message.noTemplateProvided, { name: this.name });
                }
            });
        }
    }

    /**
     * Resolve strings and values from an innerHTML string
     * @param innerHTML - The innerHTML.
     * @param self - Indicates that this should refer to itself instead of a property when creating bindings.
     * @param observerMap - ObserverMap instance for caching binding paths (optional).
     */
    private async resolveStringsAndValues(
        innerHTML: string,
        self: boolean = false,
        parentContext: string | null,
        observerMap?: ObserverMap
    ): Promise<ResolvedStringsAndValues> {
        const strings: any[] = [];
        const values: any[] = []; // these can be bindings, directives, etc.
        await this.resolveInnerHTML(
            innerHTML,
            strings,
            values,
            self,
            parentContext,
            observerMap
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
        values: Array<any>
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
        behaviorConfig: TemplateDirectiveBehaviorConfig,
        externalValues: Array<any>,
        innerHTML: string,
        self: boolean = false,
        parentContext: string | null,
        observerMap?: ObserverMap
    ): Promise<void> {
        switch (behaviorConfig.name) {
            case "when":
                {
                    const { strings, values } = await this.resolveStringsAndValues(
                        innerHTML.slice(
                            behaviorConfig.openingTagEndIndex,
                            behaviorConfig.closingTagStartIndex
                        ),
                        self,
                        parentContext,
                        observerMap
                    );

                    const { when } = await import("@microsoft/fast-element");

                    const expressionChain = getExpressionChain(behaviorConfig.value);

                    const whenLogic = resolveWhen(
                        self,
                        expressionChain as ChainedExpression,
                        parentContext,
                        observerMap
                    );

                    externalValues.push(
                        when(whenLogic, this.resolveTemplateOrBehavior(strings, values))
                    );
                }

                break;
            case "repeat":
                {
                    const valueAttr = behaviorConfig.value.split(" "); // syntax {{x in y}}
                    const { strings, values } = await this.resolveStringsAndValues(
                        innerHTML.slice(
                            behaviorConfig.openingTagEndIndex,
                            behaviorConfig.closingTagStartIndex
                        ),
                        true,
                        valueAttr[0],
                        observerMap
                    );

                    const { repeat } = await import("@microsoft/fast-element");

                    const binding = bindingResolver(
                        valueAttr[2],
                        self,
                        parentContext,
                        observerMap,
                        valueAttr[0]
                    );

                    externalValues.push(
                        repeat(
                            (x, c) => binding(x, c),
                            this.resolveTemplateOrBehavior(strings, values)
                        )
                    );
                }

                break;
            case "apply": {
                const openingTag = innerHTML.slice(
                    behaviorConfig.openingTagStartIndex,
                    behaviorConfig.openingTagEndIndex
                );
                const partial: string | undefined = openingTag
                    .split(" ")
                    .find(tagPart => {
                        return tagPart.startsWith("partial");
                    })
                    ?.split('"')[1];

                if (partial) {
                    const { when } = await import("@microsoft/fast-element");

                    const binding = bindingResolver(
                        behaviorConfig.value,
                        self,
                        parentContext,
                        observerMap
                    );

                    externalValues.push(
                        when(
                            (x, c) => binding(x, c),
                            () => this.partials[partial]
                        )
                    );
                }
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
        externalValues: Array<any>
    ) {
        switch (name) {
            case "children":
                {
                    const { children } = await import("@microsoft/fast-element");

                    externalValues.push(children(propName));
                }

                break;
            case "slotted":
                {
                    const { slotted } = await import("@microsoft/fast-element");

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
                }

                break;
            case "ref":
                {
                    const { ref } = await import("@microsoft/fast-element");

                    externalValues.push(ref(propName));
                }

                break;
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
        innerHTML: string,
        strings: Array<string>,
        values: Array<any>,
        self: boolean = false,
        behaviorConfig: DataBindingBehaviorConfig,
        parentContext: string | null,
        observerMap?: ObserverMap
    ): Promise<void> {
        switch (behaviorConfig.subtype) {
            case "content":
                {
                    strings.push(innerHTML.slice(0, behaviorConfig.openingStartIndex));
                    const propName = innerHTML.slice(
                        behaviorConfig.openingEndIndex,
                        behaviorConfig.closingStartIndex
                    );
                    const binding = bindingResolver(
                        propName,
                        self,
                        parentContext,
                        observerMap
                    );
                    const contentBinding = (x: any, c: any) => binding(x, c);
                    values.push(contentBinding);
                    await this.resolveInnerHTML(
                        innerHTML.slice(behaviorConfig.closingEndIndex, innerHTML.length),
                        strings,
                        values,
                        self,
                        parentContext,
                        observerMap
                    );
                }
                break;
            case "attribute":
                strings.push(innerHTML.slice(0, behaviorConfig.openingStartIndex));
                if (behaviorConfig.aspect === "@") {
                    const bindingHTML = innerHTML.slice(
                        behaviorConfig.openingEndIndex,
                        behaviorConfig.closingStartIndex
                    );
                    const openingParenthesis = bindingHTML.indexOf("(");
                    const closingParenthesis = bindingHTML.indexOf(")");
                    const propName = innerHTML.slice(
                        behaviorConfig.openingEndIndex,
                        behaviorConfig.closingStartIndex -
                            (closingParenthesis - openingParenthesis) -
                            1
                    );
                    const arg = bindingHTML.slice(
                        openingParenthesis + 1,
                        closingParenthesis
                    );
                    const binding = bindingResolver(
                        propName,
                        self,
                        parentContext,
                        observerMap
                    );
                    const attributeBinding = (x: any, c: any) =>
                        binding(x, c).bind(x)(
                            ...(arg === "e" ? [c.event] : []),
                            ...(arg !== "e" && arg !== ""
                                ? [
                                      bindingResolver(
                                          arg,
                                          self,
                                          parentContext,
                                          observerMap
                                      )(x, c),
                                  ]
                                : [])
                        );
                    values.push(attributeBinding);
                } else {
                    const propName = innerHTML.slice(
                        behaviorConfig.openingEndIndex,
                        behaviorConfig.closingStartIndex
                    );
                    const binding = bindingResolver(
                        propName,
                        self,
                        parentContext,
                        observerMap
                    );
                    const attributeBinding = (x: any, c: any) => binding(x, c);
                    values.push(attributeBinding);
                }

                await this.resolveInnerHTML(
                    innerHTML.slice(behaviorConfig.closingEndIndex, innerHTML.length),
                    strings,
                    values,
                    self,
                    parentContext,
                    observerMap
                );
                break;
            case "attributeDirective":
                {
                    strings.push(
                        innerHTML.slice(
                            0,
                            behaviorConfig.openingStartIndex -
                                behaviorConfig.name.length -
                                4
                        )
                    );
                    const propName = innerHTML.slice(
                        behaviorConfig.openingEndIndex,
                        behaviorConfig.closingStartIndex
                    );
                    await this.resolveAttributeDirective(
                        behaviorConfig.name,
                        propName,
                        values
                    );
                    await this.resolveInnerHTML(
                        innerHTML.slice(
                            behaviorConfig.closingEndIndex + 1,
                            innerHTML.length
                        ),
                        strings,
                        values,
                        self,
                        parentContext,
                        observerMap
                    );
                }
                break;
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
        innerHTML: string,
        strings: Array<string>,
        values: Array<any>,
        self: boolean = false,
        parentContext: string | null,
        observerMap?: ObserverMap
    ): Promise<void> {
        const behaviorConfig = getNextBehavior(innerHTML);

        if (behaviorConfig === null) {
            strings.push(innerHTML);
        } else {
            switch (behaviorConfig.type) {
                case "dataBinding":
                    await this.resolveDataBinding(
                        innerHTML,
                        strings,
                        values,
                        self,
                        behaviorConfig,
                        parentContext,
                        observerMap
                    );

                    break;
                case "templateDirective":
                    strings.push(innerHTML.slice(0, behaviorConfig.openingTagStartIndex));
                    await this.resolveTemplateDirective(
                        behaviorConfig,
                        values,
                        innerHTML,
                        self,
                        parentContext,
                        observerMap
                    );

                    await this.resolveInnerHTML(
                        innerHTML.slice(
                            behaviorConfig.closingTagEndIndex,
                            innerHTML.length
                        ),
                        strings,
                        values,
                        self,
                        parentContext,
                        observerMap
                    );

                    break;

                    break;
            }
        }
    }

    /**
     * Resolve all partial templates
     * @param unresolvedInnerHTML - The innerHTML.
     */
    private async resolveAllPartials(unresolvedInnerHTML: string): Promise<void> {
        const allPartials = Object.entries(getAllPartials(unresolvedInnerHTML));

        for (let i = 0, partialLength = allPartials.length; i < partialLength; i++) {
            const { strings, values } = await this.resolveStringsAndValues(
                allPartials[i][1].innerHTML,
                undefined,
                null,
                this.observerMap
            );
            this.partials[allPartials[i][0]] = this.resolveTemplateOrBehavior(
                strings,
                values
            );
        }
    }
}

export { TemplateElement };
