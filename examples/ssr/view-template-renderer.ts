/**
 * This code is largely a fork of lit's rendering implementation: https://github.com/lit/lit/blob/main/packages/labs/ssr/src/lib/render-lit-html.ts
 * with changes as necessary to render FAST components. A big thank you to those who contributed to lit's code above.
 */
import { ElementRenderer, RenderInfo } from "@lit-labs/ssr";
import { getElementRenderer } from "@lit-labs/ssr/lib/element-renderer";
import { DOM, HTMLDirective, ViewTemplate } from "@microsoft/fast-element";
import { Attribute, DefaultTreeNode, DefaultTreeParentNode, parseFragment } from "parse5";
import {
    extractInterpolationMarkerId,
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
    staticAttributes: Map<string, string>;
};

type CustomElementCloseOp = {
    type: "custom-element-close";
};

type CustomElementShadow = {
    type: "custom-element-shadow";
};

enum AttributeTypes {
    content,
    booleanContent,
    idl,
    event,
}

type AttributeOp = {
    type: "attribute-part";
    attributeType: AttributeTypes;
    name: string;
    binding: HTMLDirective;
    useCustomElementInstance: boolean;
};

type CustomElementAttributes = {
    type: "custom-element-attributes";
};

/**
 * A custom
 */
type Op =
    | TextOp
    | DirectiveOp
    | CustomElementOpenOp
    | CustomElementCloseOp
    | CustomElementShadow
    | AttributeOp
    | CustomElementAttributes;

interface CategorizedAttributes {
    static: Map<string, string>;
    dynamic: Map<string, string>;
}

const attributeTypeRegExp = /([:?@])?(.*)/;

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

    function skipTo(offset: number): void {
        if (lastOffset === undefined) {
            throw new Error("lastOffset is undefined");
        }
        if (offset < lastOffset) {
            throw new Error(`offset must be greater than lastOffset.
                offset: ${offset}
                lastOffset: ${lastOffset}
            `);
        }

        lastOffset = offset;
    }

    traverse(ast as any, {
        pre(node: DefaultTreeNode, parent: DefaultTreeParentNode | undefined) {
            // We need to check text nodes, comment nodes, and attributes for directive placeholders (these follow different formats).
            // When we find one, we need to retrieve the directive for it so that we can evaluate it.
            if (
                isTextNode(node) &&
                node.sourceCodeLocation !== undefined &&
                isInterpolationMarker(node)
            ) {
                flushTo(node.sourceCodeLocation.startOffset);
                const directiveId = extractInterpolationMarkerId(node)!;
                const directive = template.directives[directiveId];
                // TODO: Do something with interpolation.
            } else if (isCommentNode(node) && isMarkerComment(node)) {
                flushTo(node.sourceCodeLocation!.startOffset);
                const directiveId = DOM.extractDirectiveIndexFromMarker(
                    (node as unknown) as Comment
                );
                const directive = template.directives[directiveId];
                // TODO: Process directive. We'll need to implement some mechanism to
                // supply renderers for user-defined directives

                // console.log(directive)
            } else if (isElementNode(node)) {
                let writeTag = false;
                const tagName = node.tagName;
                let ctor: typeof HTMLElement | undefined;

                const attributes = node.attrs.reduce(
                    (prev: CategorizedAttributes, current: Attribute) => {
                        prev[isInterpolationMarker(current) ? "dynamic" : "static"].set(
                            current.name,
                            current.value
                        );

                        return prev;
                    },
                    { static: new Map(), dynamic: new Map() } as CategorizedAttributes
                );

                // Is custom element
                if (tagName.includes("-")) {
                    ctor = customElements.get(tagName);

                    if (ctor !== undefined) {
                        writeTag = true;
                        const op: CustomElementOpenOp = {
                            type: "custom-element-open",
                            tagName,
                            ctor,
                            staticAttributes: attributes.static,
                        };
                        ops.push(op);
                    }
                }

                node.attrs.forEach((attribute: Attribute): void => {
                    const isBinding = isInterpolationMarker(attribute);

                    if (isBinding) {
                        writeTag = true;
                        const attributeSourceLocation = node.sourceCodeLocation!.attrs[
                            attribute.name
                        ];
                        flushTo(attributeSourceLocation.startOffset);
                        const directiveId = extractInterpolationMarkerId(attribute)!;
                        const [, prefix, caseSensitiveName] = attributeTypeRegExp.exec(
                            attribute.name
                        )!;

                        const op: AttributeOp = {
                            type: "attribute-part",
                            name: caseSensitiveName,
                            binding: template.directives[directiveId],
                            attributeType:
                                prefix === ":"
                                    ? AttributeTypes.idl
                                    : prefix === "?"
                                    ? AttributeTypes.booleanContent
                                    : prefix === "@"
                                    ? AttributeTypes.event
                                    : AttributeTypes.content,
                            useCustomElementInstance: ctor !== undefined,
                        };
                        ops.push(op);
                        skipTo(attributeSourceLocation.endOffset);
                    }
                });

                if (writeTag) {
                    if (ctor) {
                        flushTo(node.sourceCodeLocation!.startTag.endOffset - 1);
                        ops.push({ type: "custom-element-attributes" });
                        flush(">");
                        skipTo(node.sourceCodeLocation!.startTag.endOffset);
                    } else {
                        flushTo(node.sourceCodeLocation!.startTag.endOffset);
                    }
                }

                if (ctor !== undefined) {
                    ops.push({ type: "custom-element-shadow" });
                }
            }
        },
        post(node: DefaultTreeNode) {
            if (isElementNode(node) && customElements.get(node.tagName)) {
                ops.push({ type: "custom-element-close" });
            }
        },
    });

    // Disable this to test
    // flushTo();

    return ops;
}

function* renderPropertyPart(
    instance: ElementRenderer | undefined,
    op: AttributeOp,
    value: unknown
): IterableIterator<string> {
    if (instance !== undefined) {
        instance.setProperty(op.name, value);
    }

    yield "";
}

function* renderBooleanAttributePart(
    instance: ElementRenderer | undefined,
    op: AttributeOp,
    value: boolean
): IterableIterator<string> {
    if (value) {
        if (instance !== undefined) {
            instance.setAttribute(op.name, "");
        } else {
            yield op.name;
        }
    }
}

function* renderAttributePart(
    instance: ElementRenderer | undefined,
    op: AttributeOp,
    value: unknown
): IterableIterator<string> {
    if (instance) {
        instance.setAttribute(op.name, value as string);
    } else {
        yield `${op.name}="${value}"`;
    }
}

export function* renderViewTemplate(
    template: ViewTemplate<undefined, undefined, undefined>,
    source: any,
    renderInfo: RenderInfo
): IterableIterator<string> {
    const opCodes = getTemplateOpCodes(template);

    for (const op of opCodes) {
        switch (op.type) {
            case "text":
                yield op.value;
                break;
            case "attribute-part":
                {
                    if (op.attributeType === AttributeTypes.event) {
                        // Skip any event binding
                        break;
                    }

                    // TODO: This doesn't seem safe, but need access the binding. We will want to clean that up.
                    const directive = (op.binding as any).binding;
                    const value = directive(source);
                    const instance = op.useCustomElementInstance
                        ? getLast(renderInfo.customElementInstanceStack)
                        : undefined;
                    yield* (op.attributeType === AttributeTypes.idl
                        ? renderPropertyPart
                        : op.attributeType === AttributeTypes.booleanContent
                        ? renderBooleanAttributePart
                        : renderAttributePart)(instance, op, value);
                }
                break;
            case "custom-element-open": {
                const instance = getElementRenderer(
                    renderInfo,
                    op.tagName,
                    op.ctor,
                    op.staticAttributes
                );

                if (instance !== undefined) {
                    for (const [name, value] of op.staticAttributes) {
                        instance.setAttribute(name, value);
                    }

                    renderInfo.customElementInstanceStack.push(instance);
                }
                break;
            }
            case "custom-element-close": {
                renderInfo.customElementInstanceStack.pop();
                break;
            }
            case "custom-element-attributes": {
                const instance = getLast(renderInfo.customElementInstanceStack);

                if (instance !== undefined) {
                    // Connect instance
                    instance.connectedCallback();

                    yield* instance.renderAttributes();

                    if (renderInfo.customElementHostStack.length > 0) {
                        yield " defer-hydration";
                    }
                }
            }
        }
    }
}
