import { ExpressionContext } from "./interfaces";
import { HTMLTemplate } from "./template";
import {
    BehaviorFactory,
    CompositeBehaviorFactory,
    CompositeBehavior,
} from "./directives/behavior";
import { DOM } from "./dom";
import { BindingDirective, BindingType, BindingBehavior } from "./directives/binding";
import { Directive, AttachedBehaviorDirective } from "./directives/directive";

type MaybeNode = Node | null;
type InlineDirective = BindingDirective | AttachedBehaviorDirective;

const prefixToBindingType: Record<string, BindingType> = {
    "@": BindingType.trigger,
    $: BindingType.attribute,
    "?": BindingType.booleanAttribute,
};

export class TemplateCompiler {
    public static instance = new TemplateCompiler();

    public compile(
        html: string | HTMLTemplateElement,
        directives: Directive[]
    ): HTMLTemplate {
        let element: HTMLTemplateElement;

        if (typeof html === "string") {
            element = document.createElement("template");
            element.innerHTML = html;

            const fec = element.content.firstElementChild;

            if (fec !== null && fec.tagName === "TEMPLATE" && !DOM.isMarker(fec)) {
                element = fec as HTMLTemplateElement;
            }
        } else {
            element = html;
        }

        const viewFactories: BehaviorFactory[] = [];
        const hostFactory = this.compileAttributes(element, directives, true);

        const node = element.content;
        let currentChild: MaybeNode = node.firstChild;

        while (currentChild) {
            currentChild = this.compileNode(
                currentChild,
                node,
                directives,
                viewFactories
            );
        }

        return new HTMLTemplate(element, viewFactories, hostFactory);
    }

    private compileNode(
        node: Node,
        parentNode: Node,
        directives: Directive[],
        factories: BehaviorFactory[]
    ): MaybeNode {
        switch (node.nodeType) {
            case 1: //element node
                return DOM.isMarker(node)
                    ? this.compileBlock(node as HTMLElement, directives, factories)
                    : this.compileElement(node as HTMLElement, directives, factories);
            case 3: //text node
                //use wholeText to retrieve the textContent of all adjacent text nodes.
                const directive = this.tryParsePlaceholders(
                    (node as Text).wholeText,
                    directives
                ) as BindingDirective;

                if (directive !== null) {
                    const marker = DOM.createTextMarker();
                    (node.parentNode || parentNode).insertBefore(marker, node);
                    node.textContent = " ";

                    directive.type = BindingType.text;
                    factories.push(directive);

                    //remove adjacent text nodes.
                    while (node.nextSibling && node.nextSibling.nodeType === 3) {
                        (node.parentNode || parentNode).removeChild(node.nextSibling);
                    }
                } else {
                    //skip parsing adjacent text nodes.
                    while (node.nextSibling && node.nextSibling.nodeType === 3) {
                        node = node.nextSibling;
                    }
                }

                return node.nextSibling;
            default:
                break;
        }

        return node.nextSibling;
    }

    private compileElement(
        node: HTMLElement,
        directives: Directive[],
        factories: BehaviorFactory[]
    ): MaybeNode {
        const elementFactory = this.compileAttributes(node, directives);

        if (elementFactory !== null) {
            DOM.makeIntoBehaviorTarget(node);
            factories.push(elementFactory);
        }

        let currentChild: MaybeNode = node.firstChild;
        while (currentChild) {
            currentChild = this.compileNode(currentChild, node, directives, factories);
        }

        return node.nextSibling;
    }

    private compileAttributes(
        node: HTMLElement,
        directives: Directive[],
        includeBasicValues: boolean = false
    ) {
        const attributes = node.attributes;
        let elementFactory: BehaviorFactory | null = null;

        for (let i = 0, ii = attributes.length; i < ii; ++i) {
            const attr = attributes[i];
            const attrName = attr.name;
            const attrValue = attr.value;
            let directive = this.tryParsePlaceholders(attrValue, directives);

            if (directive !== null) {
                this.prepareAttributeDirective(node, attrName, directive);
            } else if (includeBasicValues) {
                const attrDirective = new BindingDirective(x => attrValue);
                attrDirective.targetName = attrName;
                attrDirective.type = BindingType.attribute;
                directive = attrDirective;
            }

            if (directive !== null) {
                node.removeAttributeNode(attr);
                i--;
                ii--;

                if (elementFactory === null) {
                    elementFactory = directive;
                } else {
                    elementFactory = new CompositeBehaviorFactory(
                        elementFactory,
                        directive
                    );
                }
            }
        }

        return elementFactory;
    }

    private compileBlock(
        node: HTMLElement,
        directives: Directive[],
        factories: BehaviorFactory[]
    ): MaybeNode {
        factories.push(directives[parseInt(node.getAttribute("i")!)]);
        return node.nextSibling!;
    }

    private prepareAttributeDirective(
        element: HTMLElement,
        attrName: string,
        directive: InlineDirective
    ) {
        if (directive instanceof AttachedBehaviorDirective) {
            return;
        }

        const firstChar = attrName[0];
        const bindingType = prefixToBindingType[firstChar];

        if (bindingType === void 0) {
            if (attrName === "style") {
                directive.type = BindingType.attribute;
                directive.targetName = "style";
            } else {
                directive.targetName = this.attrNameToPropertyName(
                    element.tagName,
                    attrName
                );
            }
        } else {
            directive.type = bindingType;
            directive.targetName = attrName.substr(1);
        }
    }

    public attrNameToPropertyName(tagName: string, attr: string): string {
        switch (tagName) {
            case "LABEL":
                switch (attr) {
                    case "for":
                        return "htmlFor";
                    default:
                        return attr;
                }
            case "IMG":
                switch (attr) {
                    case "usemap":
                        return "useMap";
                    default:
                        return attr;
                }
            case "INPUT":
                switch (attr) {
                    case "maxlength":
                        return "maxLength";
                    case "minlength":
                        return "minLength";
                    case "formaction":
                        return "formAction";
                    case "formenctype":
                        return "formEncType";
                    case "formmethod":
                        return "formMethod";
                    case "formnovalidate":
                        return "formNoValidate";
                    case "formtarget":
                        return "formTarget";
                    case "inputmode":
                        return "inputMode";
                    default:
                        return attr;
                }
            case "TEXTAREA":
                switch (attr) {
                    case "maxlength":
                        return "maxLength";
                    default:
                        return attr;
                }
            case "TD":
            case "TH":
                switch (attr) {
                    case "rowspan":
                        return "rowSpan";
                    case "colspan":
                        return "colSpan";
                    default:
                        return attr;
                }
            default:
                switch (attr) {
                    case "class":
                        return "classList";
                    case "accesskey":
                        return "accessKey";
                    case "contenteditable":
                        return "contentEditable";
                    case "tabindex":
                        return "tabIndex";
                    case "textcontent":
                        return "textContent";
                    case "innerhtml":
                        return "innerHTML";
                    case "scrolltop":
                        return "scrollTop";
                    case "scrollleft":
                        return "scrollLeft";
                    case "readonly":
                        return "readOnly";
                    default:
                        return attr;
                }
        }
    }

    tryParsePlaceholders(value: string, directives: Directive[]): InlineDirective | null {
        let i = value.indexOf("@{", 0);
        let ii = value.length;
        let char;
        let pos = 0;
        let open = 0;
        let quote = null;
        let interpolationStart;
        let parts: (string | Directive)[] | null;
        let partIndex = 0;

        while (i >= 0 && i < ii - 2) {
            open = 1;
            interpolationStart = i;
            i += 2;

            do {
                char = value[i];
                i++;

                if (char === "'" || char === '"') {
                    if (quote === null) {
                        quote = char;
                    } else if (quote === char) {
                        quote = null;
                    }
                    continue;
                }

                if (char === "\\") {
                    i++;
                    continue;
                }

                if (quote !== null) {
                    continue;
                }

                if (char === "{") {
                    open++;
                } else if (char === "}") {
                    open--;
                }
            } while (open > 0 && i < ii);

            if (open === 0) {
                // lazy allocate array
                parts = parts! || [];
                if (
                    value[interpolationStart - 1] === "\\" &&
                    value[interpolationStart - 2] !== "\\"
                ) {
                    // escaped interpolation
                    parts[partIndex] =
                        value.substring(pos, interpolationStart - 1) +
                        value.substring(interpolationStart, i);
                    partIndex++;
                    // parts[partIndex] = this.emptyStringExpression;
                    // partIndex++;
                } else {
                    // standard interpolation
                    parts[partIndex] = value.substring(pos, interpolationStart);
                    partIndex++;
                    let directiveIndex = parseInt(
                        value.substring(interpolationStart + 2, i - 1)
                    );
                    let directive = directives[directiveIndex];
                    parts[partIndex] = directive;
                    partIndex++;
                }
                pos = i;
                i = value.indexOf("@{", i);
            } else {
                break;
            }
        }

        // no interpolation.
        if (partIndex === 0) {
            return null;
        }

        // literal.
        parts![partIndex] = value.substr(pos);
        parts = parts!.filter(x => x !== "");

        if (parts.length == 1) {
            return parts[0] as InlineDirective;
        }

        const finalParts = parts!.map(
            x => (typeof x === "string" ? x : (x as BindingDirective).expression)
        );

        const expression = (scope: unknown, context: ExpressionContext) => {
            let output = "";

            for (let i = 0, ii = finalParts.length; i < ii; ++i) {
                const current = finalParts[i];
                output =
                    output +
                    (typeof current === "string" ? current : current(scope, context));
            }

            return output;
        };

        return new BindingDirective(expression);
    }
}
