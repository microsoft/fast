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

/**
 * The <f-template> custom element that will provide view logic to the element
 */
class TemplateElement extends FASTElement {
    /**
     * The name of the custom element this template will be applied to
     */
    @attr
    public name?: string;

    private openBinding: string = "{{";

    private closeBinding: string = "}}";

    connectedCallback(): void {
        super.connectedCallback();

        if (this.name) {
            this.$fastController.definition.registry
                .whenDefined(this.name)
                .then(value => {
                    const registeredFastElement: FASTElementDefinition | undefined =
                        fastElementRegistry.getByType(value);
                    const template = this.getElementsByTagName("template").item(0);

                    if (template) {
                        const strings: any[] = [];
                        const values: any[] = []; // these can be bindings, directives, etc.

                        this.resolveInnerHTML(this.innerHTML, strings, values);

                        (strings as any).raw = strings.map(value =>
                            String.raw({ raw: value })
                        );

                        if (registeredFastElement) {
                            // all new elements will get the updated template
                            registeredFastElement.template = ViewTemplate.create(
                                strings,
                                values,
                                DOMPolicy.create()
                            );
                        }
                    } else {
                        throw FAST.error(Message.noTemplateProvided, { name: this.name });
                    }
                });
        }
    }

    /**
     * Resolver of the innerHTML string
     * @param innerHTML - The innerHTML.
     * @param strings The strings array.
     * @param values The interpreted values.
     */
    private resolveInnerHTML(
        innerHTML: string,
        strings: Array<string>,
        values: Array<any>
    ): void {
        const bindingOpen = innerHTML.indexOf(this.openBinding);
        const bindingClose = innerHTML.indexOf(this.closeBinding);

        if (bindingOpen !== -1 && bindingClose !== -1) {
            strings.push(innerHTML.slice(0, bindingOpen));
            values.push((x: any) => x[innerHTML.slice(bindingOpen + 2, bindingClose)]);

            this.resolveInnerHTML(
                innerHTML.slice(bindingClose + 2, innerHTML.length),
                strings,
                values
            );
        } else {
            strings.push(innerHTML);
        }
    }
}

export { TemplateElement };
