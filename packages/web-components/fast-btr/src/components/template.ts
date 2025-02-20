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

    private bindingRegex: RegExp = /{{(?:.*?)}}/g;

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
                        const childNodes = template.content.childNodes;
                        const strings: any[] = [];
                        const values: any[] = []; // these can be bindings, directives, etc.

                        childNodes.forEach(childNode => {
                            switch (childNode.nodeType) {
                                case 1: // HTMLElement
                                    break;
                                case 3: // text
                                    this.resolveTextBindings(childNode, strings, values);
                                    break;
                                default:
                                    break;
                            }
                        });

                        strings.push("");

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
     * Resolve a text binding
     * @param childNode The child node to interpret.
     * @param strings The strings array.
     * @param values The interpreted values.
     */
    private resolveTextBindings(
        childNode: ChildNode,
        strings: Array<string>,
        values: Array<any>
    ) {
        const textContent = childNode.textContent || "";
        const bindingArray = textContent.match(this.bindingRegex);
        const stringArray = textContent.split(this.bindingRegex);

        if (bindingArray) {
            bindingArray.forEach((htmlBindingItem, index) => {
                // create a binding
                const sansBindingStrings = htmlBindingItem
                    .replace(this.openBinding, "")
                    .replace(this.closeBinding, "")
                    .trim();
                const bindingItem = (x: any) => x[sansBindingStrings];
                strings.push(stringArray[index]);
                values.push(bindingItem);
            });
        } else {
            strings.push(textContent);
        }
    }
}

export { TemplateElement };
