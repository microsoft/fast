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

    /**
     * The binding regex used to identify declarative HTML bindings.
     */
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

                        this.resolveChildNodes(childNodes, strings, values);

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
     * Resolves child nodes
     * @param childNode The child node to interpret.
     * @param strings The strings array.
     * @param values The interpreted values.
     */
    private resolveChildNodes(
        childNodes: NodeListOf<ChildNode>,
        strings: Array<string>,
        values: Array<any>
    ): void {
        childNodes.forEach(childNode => {
            switch (childNode.nodeType) {
                case 1: // HTMLElement
                    this.resolveHTMLElement(childNode, strings, values);
                    break;
                case 3: // text
                    this.resolveTextBindings(childNode, strings, values);
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * Resolves the last string in the array and appends a new string to it
     * @param newString The new string for the template.
     * @param strings The strings array.
     * @param values The interpreted values.
     */
    private resolveLastStringItem(
        newString: string,
        strings: Array<string>,
        stringsLength: number
    ): void {
        strings[stringsLength - 1] = `${strings[stringsLength - 1]}${newString}`;
    }

    /**
     * Resolves a string to either the previous string value or as a new string in the array
     * @param newString The new string for the template.
     * @param strings The strings array.
     * @param values The interpreted values.
     */
    private resolveString(
        newString: string,
        strings: Array<string>,
        values: Array<any>
    ): void {
        const stringsLength = strings.length;

        if (stringsLength > values.length) {
            this.resolveLastStringItem(newString, strings, stringsLength);
        } else {
            strings.push(newString);
        }
    }

    /**
     * Resolves an HTMLElement
     * @param childNode The child node to interpret.
     * @param strings The strings array.
     * @param values The interpreted values.
     */
    private resolveHTMLElement(
        childNode: ChildNode,
        strings: Array<string>,
        values: Array<any>
    ): void {
        const tagName = childNode.nodeName.toLowerCase();

        strings.push(`<${tagName}`);

        const attributes = (childNode as HTMLElement).attributes;

        for (let i = 0, attributeLength = attributes.length; i < attributeLength; i++) {
            const bindingAttr = attributes.item(i)?.value.match(this.bindingRegex);

            this.resolveLastStringItem(" ", strings, strings.length);

            if (bindingAttr) {
                this.resolveLastStringItem(
                    `${attributes.item(i)?.name}="`,
                    strings,
                    strings.length
                );
                // create a binding
                const sansBindingStrings = bindingAttr[0]
                    .replace(this.openBinding, "")
                    .replace(this.closeBinding, "")
                    .trim();
                const bindingItem = (x: any) => x[sansBindingStrings];
                values.push(bindingItem);
                strings.push('"');
            } else {
                this.resolveString(
                    ` ${attributes.item(i)?.name}="${attributes.item(i)?.value}"`,
                    strings,
                    values
                );
            }
        }

        this.resolveString(`>`, strings, values);

        if (childNode.hasChildNodes()) {
            this.resolveChildNodes(childNode.childNodes, strings, values);
            this.resolveLastStringItem(`</${tagName}>`, strings, strings.length);
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
    ): void {
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

        strings.push("");
    }
}

export { TemplateElement };
