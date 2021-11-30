/**
 * Much of this code borrows heavily from lit's rendering implementation: https://github.com/lit/lit/blob/main/packages/labs/ssr/src/lib/render-lit-html.ts
 * A big thank you to those who contributed to that code.
 */
import { DOM, HTMLDirective, ViewTemplate } from "@microsoft/fast-element";
import { Attribute, DefaultTreeNode, DefaultTreeParentNode, parseFragment } from "parse5";
import {
    getLast,
    isCommentNode,
    isElementNode,
    isInterpolationMarker,
    isMarkerComment,
    isTextNode,
    traverse,
} from "./parse-5-utils";

/**
 * Operation to output static text
 */
type TextOp = {
    type: "text";
    value: string;
};

/**
 * A directive found in the template
 */
type DirectiveOp = {
    type: "directive";
    directive: HTMLDirective;
};

type CustomElementOpenOp = {
    type: "custom-element-open";
    tagName: string;
    ctor: typeof HTMLElement;
    staticAttributes: Record<string, string>;
};

/**
 * A custom
 */
type Op = TextOp | DirectiveOp | CustomElementOpenOp;

interface CategorizedAttributes {
    static: Record<string, string>;
    dynamic: Record<string, string>;
}

// Cache template operations
const templateCache = new Map<ViewTemplate, Op[]>();
function getTemplateOpCodes(template: ViewTemplate): Op[] {
    if (templateCache.has(template)) {
        return templateCache.get(template)!;
    }

    const html =
        typeof template.html === "string" ? template.html : template.html.innerHTML;
    const ast = parseFragment(html, {
        sourceCodeLocationInfo: true,
    });
    const ops: Op[] = [];

    /* The last offset of html written to the stream */
    let lastOffset: number | undefined = 0;
    templateCache.set(template, ops);

    /**
     * Records the given string to the output, either by appending to the current
     * opcode (if already `text`) or by creating a new `text` opcode (if the
     * previous opcode was not `text)
     */
    function flush(value: string): void {
        const last = getLast(ops);

        if (last !== undefined && last.type === "text") {
            last.value += value;
        } else {
            ops.push({
                type: "text",
                value,
            });
        }
    }

    /**
     * Creates or appends to a text opcode with a substring of the html from the
     * `lastOffset` flushed to `offset`.
     */
    function flushTo(offset?: number): void {
        if (lastOffset === undefined) {
            throw new Error("lastOffset is undefined");
        }
        const previousLastOffset = lastOffset;
        lastOffset = offset;
        const value = String(html).substring(previousLastOffset, offset);
        flush(value);
    }

    traverse(ast as any, {
        pre(node: DefaultTreeNode, parent: DefaultTreeParentNode | undefined) {
            // We need to check text nodes, comment nodes, and attributes for directive placeholers (these follow different formats).
            // When we find one, we need to retrieve the directive for it so that we can evalute it.
            if (
                isTextNode(node) &&
                node.sourceCodeLocation !== undefined &&
                isInterpolationMarker(node)
            ) {
                flushTo(node.sourceCodeLocation.startOffset);
                // TODO: Do something with interpolation.
            } else if (isCommentNode(node) && isMarkerComment(node)) {
                const directiveId = DOM.extractDirectiveIndexFromMarker(
                    (node as unknown) as Comment
                );
                const directive = template.directives[directiveId];
                // TODO: Process directive. We'll need to implement some mechanism to
                // supply renderers for user-defined directives
            } else if (isElementNode(node)) {
                let writeTag = false;
                const tagName = node.tagName;
                let ctor: typeof HTMLElement | undefined;

                const attributes = node.attrs.reduce(
                    (prev: CategorizedAttributes, current: Attribute) => {
                        prev[isInterpolationMarker(current) ? "dynamic" : "static"][
                            current.name
                        ] = current.value;

                        return prev;
                    },
                    { static: {}, dynamic: {} } as CategorizedAttributes
                );

                // Is custom element
                if (tagName.includes("-")) {
                    ctor = customElements.get(tagName);

                    if (ctor !== undefined) {
                        writeTag = true;
                        flushTo(node.sourceCodeLocation!.startOffset);
                        const op: CustomElementOpenOp = {
                            type: "custom-element-open",
                            tagName,
                            ctor,
                            staticAttributes: attributes.static,
                        };
                        ops.push(op);
                    }
                }
            }
        },
        post(node: DefaultTreeNode) {
            // console.log(node.nodeName);
        },
    });

    flushTo();

    return ops;
}

export function* renderViewTemplate(
    template: ViewTemplate<undefined, undefined, undefined>
): IterableIterator<string> {
    const opCodes = getTemplateOpCodes(template);
    opCodes.forEach((code: Op) => {
        if (code.type === "text") {
            console.log(code.value);
        }
    });
    yield "";
}
