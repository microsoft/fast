import {
    attr,
    elements,
    DOMAspect,
    DOMSink,
    FAST,
    FASTElement,
    FASTElementDefinition,
    fastElementRegistry,
    ShadowRootOptions,
    ViewTemplate,
} from "@microsoft/fast-element";
import { DOMPolicy } from "@microsoft/fast-element/dom-policy.js";
import { Message } from "../interfaces.js";
import {
    AttributeDirective,
    ChainedExpression,
    DataBindingBehaviorConfig,
    getAllPartials,
    getExpressionChain,
    getNextBehavior,
    pathResolver,
    resolveWhen,
    TemplateDirectiveBehaviorConfig,
    transformInnerHTML,
} from "./utilities.js";

interface ResolvedStringsAndValues {
    strings: Array<string>;
    values: Array<any>;
}

function allow(
    tagName: string | null,
    aspect: DOMAspect,
    aspectName: string,
    sink: DOMSink
): DOMSink {
    return (target: Node, name: string, value: string, ...rest: any[]) => {
        sink(target, name, value, ...rest);
    };
}

/**
 * A dictionary of element options the TemplateElement will use to update the registered element
 */
interface ElementOptions {
    [key: string]: {
        shadowOptions: ShadowRootOptions | undefined;
    };
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
    public static elementOptions: ElementOptions = {};

    private partials: { [key: string]: ViewTemplate } = {};

    public static options(elementOptions: ElementOptions = {}) {
        this.elementOptions = elementOptions;

        return this;
    }

    connectedCallback(): void {
        super.connectedCallback();

        if (this.name) {
            this.$fastController.definition.registry
                .whenDefined(this.name)
                .then(async value => {
                    const registeredFastElement: FASTElementDefinition | undefined =
                        fastElementRegistry.getByType(value);
                    const template = this.getElementsByTagName("template").item(0);

                    if (template) {
                        const innerHTML = await transformInnerHTML(this.innerHTML);

                        await this.resolveAllPartials(innerHTML);

                        const { strings, values } = await this.resolveStringsAndValues(
                            innerHTML
                        );

                        if (registeredFastElement) {
                            // all new elements will get the updated template
                            registeredFastElement.template =
                                this.resolveTemplateOrBehavior(strings, values);
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
     */
    private async resolveStringsAndValues(
        innerHTML: string,
        self: boolean = false
    ): Promise<ResolvedStringsAndValues> {
        const strings: any[] = [];
        const values: any[] = []; // these can be bindings, directives, etc.
        await this.resolveInnerHTML(innerHTML, strings, values, self);

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
        return ViewTemplate.create(
            strings,
            values,
            DOMPolicy.create({
                guards: {
                    aspects: {
                        [DOMAspect.property]: {
                            innerHTML: allow,
                        },
                    },
                },
            })
        );
    }

    /**
     * Resolve a template directive
     * @param behaviorConfig - The directive behavior configuration object.
     * @param externalValues - The interpreted values from the parent.
     * @param innerHTML - The innerHTML.
     */
    private async resolveTemplateDirective(
        behaviorConfig: TemplateDirectiveBehaviorConfig,
        externalValues: Array<any>,
        innerHTML: string,
        self: boolean = false
    ): Promise<void> {
        switch (behaviorConfig.name) {
            case "when":
                {
                    const { strings, values } = await this.resolveStringsAndValues(
                        innerHTML.slice(
                            behaviorConfig.openingTagEndIndex,
                            behaviorConfig.closingTagStartIndex
                        ),
                        self
                    );

                    const { when } = await import("@microsoft/fast-element");

                    const expressionChain = getExpressionChain(behaviorConfig.value);

                    const whenLogic = resolveWhen(
                        self,
                        expressionChain as ChainedExpression
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
                        true
                    );

                    const { repeat } = await import("@microsoft/fast-element");

                    externalValues.push(
                        repeat(
                            (x, c) => pathResolver(valueAttr[2], self)(x, c),
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

                    externalValues.push(
                        when(
                            (x, c) => pathResolver(behaviorConfig.value, self)(x, c),
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

                    const parts = propName.split(" ");
                    const slottedOption = {
                        property: parts[0],
                    };

                    if (parts[1] === "filter" && parts[2]) {
                        const matches = parts[2].match(/(\w+)(\(([^)]*)\))?/);
                        const filterName = matches?.[1];
                        const filterParams = matches?.[3] ?? undefined;

                        switch (filterName) {
                            case "elements":
                                Object.assign(slottedOption, {
                                    filter: elements(filterParams),
                                });
                                break;
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
     */
    private async resolveDataBinding(
        innerHTML: string,
        strings: Array<string>,
        values: Array<any>,
        self: boolean = false,
        behaviorConfig: DataBindingBehaviorConfig
    ): Promise<void> {
        switch (behaviorConfig.subtype) {
            case "content":
                {
                    strings.push(innerHTML.slice(0, behaviorConfig.openingStartIndex));
                    const propName = innerHTML.slice(
                        behaviorConfig.openingEndIndex,
                        behaviorConfig.closingStartIndex
                    );
                    const binding = (x: any, c: any) =>
                        pathResolver(propName, self)(x, c);
                    values.push(binding);
                    await this.resolveInnerHTML(
                        innerHTML.slice(behaviorConfig.closingEndIndex, innerHTML.length),
                        strings,
                        values,
                        self
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
                    const binding = (x: any, c: any) =>
                        pathResolver(propName, self)(x, c).bind(x)(
                            ...(arg === "e" ? [c.event] : []),
                            ...(arg !== "e" && arg !== ""
                                ? [pathResolver(arg)(x, c)]
                                : [])
                        );
                    values.push(binding);
                } else {
                    const propName = innerHTML.slice(
                        behaviorConfig.openingEndIndex,
                        behaviorConfig.closingStartIndex
                    );
                    const binding = (x: any, c: any) =>
                        pathResolver(propName, self)(x, c);
                    values.push(binding);
                }

                await this.resolveInnerHTML(
                    innerHTML.slice(behaviorConfig.closingEndIndex, innerHTML.length),
                    strings,
                    values,
                    self
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
                        self
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
     */
    private async resolveInnerHTML(
        innerHTML: string,
        strings: Array<string>,
        values: Array<any>,
        self: boolean = false
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
                        behaviorConfig
                    );

                    break;
                case "templateDirective":
                    strings.push(innerHTML.slice(0, behaviorConfig.openingTagStartIndex));
                    await this.resolveTemplateDirective(
                        behaviorConfig,
                        values,
                        innerHTML,
                        self
                    );

                    await this.resolveInnerHTML(
                        innerHTML.slice(
                            behaviorConfig.closingTagEndIndex,
                            innerHTML.length
                        ),
                        strings,
                        values,
                        self
                    );

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
                allPartials[i][1].innerHTML
            );
            this.partials[allPartials[i][0]] = this.resolveTemplateOrBehavior(
                strings,
                values
            );
        }
    }
}

export { TemplateElement };
