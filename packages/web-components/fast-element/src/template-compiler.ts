import { BehaviorFactory } from "./directives/behavior.js";
import { DOM } from "./dom.js";
import { BindingDirective } from "./directives/binding.js";
import { AttachedBehaviorDirective, Directive } from "./directives/directive.js";
import { ExecutionContext } from "./observation/observable.js";

type InlineDirective = BindingDirective | AttachedBehaviorDirective;
const compilationContext = { locatedDirectives: 0, targetIndex: -1 };

function tryParsePlaceholders(
    value: string,
    directives: Directive[]
): InlineDirective | null {
    let i = value.indexOf("@{", 0);
    const ii = value.length;
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
            } else {
                // standard interpolation
                parts[partIndex] = value.substring(pos, interpolationStart);
                partIndex++;
                const directiveIndex = parseInt(
                    value.substring(interpolationStart + 2, i - 1)
                );
                const directive = directives[directiveIndex];
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
    parts = parts!.filter((x: string | Directive) => x !== "");

    if (parts.length == 1) {
        compilationContext.locatedDirectives++;
        return parts[0] as InlineDirective;
    }

    let targetName!: string;
    const partCount = parts.length;
    const finalParts = parts!.map((x: string | Directive) => {
        if (typeof x === "string") {
            return (): string => x;
        }

        targetName = (x as BindingDirective).targetName || targetName;
        compilationContext.locatedDirectives++;
        return (x as BindingDirective).expression;
    });

    const expression = (scope: unknown, context: ExecutionContext): string => {
        let output = "";

        for (let i = 0; i < partCount; ++i) {
            output += finalParts[i](scope, context);
        }

        return output;
    };

    const binding = new BindingDirective(expression);
    binding.targetName = targetName;
    return binding;
}

function compileAttributes(
    node: HTMLElement,
    directives: Directive[],
    factories: BehaviorFactory[],
    includeBasicValues: boolean = false
): void {
    const attributes = node.attributes;

    for (let i = 0, ii = attributes.length; i < ii; ++i) {
        const attr = attributes[i];
        const attrValue = attr.value;
        let directive = tryParsePlaceholders(attrValue, directives);

        if (directive === null && includeBasicValues) {
            /* eslint-disable-next-line */
            directive = new BindingDirective(x => attrValue);
            directive.targetName = attr.name;
        }

        if (directive !== null) {
            node.removeAttributeNode(attr);
            i--;
            ii--;

            directive.targetIndex = compilationContext.targetIndex;
            factories.push(directive);
        }
    }
}

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
export function compileTemplate(template: HTMLTemplateElement, directives: Directive[]) {
    const hostBehaviorFactories: BehaviorFactory[] = [];

    compilationContext.locatedDirectives = 0;
    compileAttributes(template, directives, hostBehaviorFactories, true);

    const fragment = template.content;
    const viewBehaviorFactories: BehaviorFactory[] = [];
    const directiveCount = directives.length;
    const walker = document.createTreeWalker(
        fragment,
        133, // element, text, comment
        null,
        false
    );

    compilationContext.targetIndex = -1;

    while (compilationContext.locatedDirectives < directiveCount) {
        const node = walker.nextNode();

        if (node === null) {
            break;
        }

        compilationContext.targetIndex++;

        switch (node.nodeType) {
            case 1: // element node
                compileAttributes(node as HTMLElement, directives, viewBehaviorFactories);
                break;
            case 3: // text node
                // use wholeText to retrieve the textContent of all adjacent text nodes.
                const directive = tryParsePlaceholders(
                    (node as Text).wholeText,
                    directives
                ) as BindingDirective;

                if (directive !== null) {
                    node.textContent = " ";
                    directive.makeIntoTextBinding();
                    viewBehaviorFactories.push(directive);
                    directive.targetIndex = compilationContext.targetIndex;

                    //remove adjacent text nodes.
                    while (node.nextSibling && node.nextSibling.nodeType === 3) {
                        node.parentNode!.removeChild(node.nextSibling);
                    }
                }

                break;
            case 8: // comment
                if (DOM.isMarker(node)) {
                    const directive =
                        directives[DOM.extractDirectiveIndexFromMarker(node)];
                    directive.targetIndex = compilationContext.targetIndex;
                    compilationContext.locatedDirectives++;
                    viewBehaviorFactories.push(directive);
                } else {
                    node.parentNode!.removeChild(node);
                    compilationContext.targetIndex--;
                }
        }
    }

    let targetOffset = 0;

    if (DOM.isMarker(fragment.firstChild!)) {
        // If the first node in a fragment is a marker, that means it's an unstable first node,
        // because something like a when, repeat, etc. could add nodes before the marker.
        // To mitigate this, we insert a stable first node. However, if we insert a node,
        // that will alter the result of the TreeWalker. So, we also need to offset the target index.
        fragment.insertBefore(document.createComment(""), fragment.firstChild);
        targetOffset = -1;
    }

    return {
        fragment,
        viewBehaviorFactories,
        hostBehaviorFactories,
        targetOffset,
    };
}
