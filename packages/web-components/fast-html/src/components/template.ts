import {
    attr,
    FAST,
    FASTElement,
    FASTElementDefinition,
    fastElementRegistry,
    ViewTemplate,
} from "@microsoft/fast-element";
import { DOMPolicy } from "@microsoft/fast-element/dom-policy.js";
import { Message } from "../interfaces.js";
import {
    DataBindingBehaviorConfig,
    DirectiveBehaviorConfig,
    getNextBehavior,
} from "./utilities.js";

interface ResolvedStringsAndValues {
    strings: Array<string>;
    values: Array<any>;
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
                        const { strings, values } = await this.resolveStringsAndValues(
                            this.innerHTML
                        );

                        if (registeredFastElement) {
                            // all new elements will get the updated template
                            registeredFastElement.template =
                                this.resolveTemplateOrBehavior(strings, values);
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
        return ViewTemplate.create(strings, values, DOMPolicy.create());
    }

    /**
     * Resolve a directive
     * @param behaviorConfig - The directive behavior configuration object.
     * @param externalValues - The interpreted values from the parent.
     * @param innerHTML - The innerHTML.
     */
    private async resolveDirective(
        behaviorConfig: DirectiveBehaviorConfig,
        externalValues: Array<any>,
        innerHTML: string
    ): Promise<void> {
        switch (behaviorConfig.name) {
            case "when":
                {
                    const { strings, values } = await this.resolveStringsAndValues(
                        innerHTML.slice(
                            behaviorConfig.openingTagEndIndex,
                            behaviorConfig.closingTagStartIndex
                        )
                    );

                    const { when } = await import("@microsoft/fast-element");

                    externalValues.push(
                        when(
                            x => x?.[behaviorConfig.value],
                            this.resolveTemplateOrBehavior(strings, values)
                        )
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
                            x => x?.[valueAttr[2]],
                            this.resolveTemplateOrBehavior(strings, values)
                        )
                    );
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
        strings.push(innerHTML.slice(0, behaviorConfig.openingStartIndex));

        switch (behaviorConfig.subtype) {
            case "content":
                {
                    const propName = innerHTML.slice(
                        behaviorConfig.openingEndIndex,
                        behaviorConfig.closingStartIndex
                    );
                    const binding = self ? (x: any) => x : (x: any) => x[propName];
                    values.push(binding);
                }
                break;
            case "attribute":
                if (behaviorConfig.aspect === "@") {
                    const propName = innerHTML.slice(
                        behaviorConfig.openingEndIndex,
                        behaviorConfig.closingStartIndex - 2
                    );
                    const binding = (x: any) => x[propName]();
                    values.push(binding);
                } else {
                    const propName = innerHTML.slice(
                        behaviorConfig.openingEndIndex,
                        behaviorConfig.closingStartIndex
                    );
                    const binding = self ? (x: any) => x : (x: any) => x[propName];
                    values.push(binding);
                }
                break;
        }

        await this.resolveInnerHTML(
            innerHTML.slice(behaviorConfig.closingEndIndex, innerHTML.length),
            strings,
            values
        );
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
                case "directive":
                    strings.push(innerHTML.slice(0, behaviorConfig.openingTagStartIndex));
                    await this.resolveDirective(behaviorConfig, values, innerHTML);

                    await this.resolveInnerHTML(
                        innerHTML.slice(
                            behaviorConfig.closingTagEndIndex,
                            innerHTML.length
                        ),
                        strings,
                        values
                    );

                    break;
            }
        }
    }
}

export { TemplateElement };
