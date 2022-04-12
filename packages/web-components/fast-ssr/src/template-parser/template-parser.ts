/**
 * This code is largely a fork of lit's rendering implementation: https://github.com/lit/lit/blob/main/packages/labs/ssr/src/lib/render-lit-html.ts
 * with changes as necessary to render FAST components. A big thank you to those who contributed to lit's code above.
 */
import {
    Aspect,
    Aspected,
    Compiler,
    Parser,
    ViewBehaviorFactory,
    ViewTemplate,
} from "@microsoft/fast-element";
import {
    Attribute,
    DefaultTreeCommentNode,
    DefaultTreeElement,
    DefaultTreeNode,
    DefaultTreeParentNode,
    DefaultTreeTextNode,
    parseFragment,
} from "parse5";
import { AttributeBindingOp, Op, OpType } from "./op-codes.js";

/**
 * Cache the results of template parsing.
 */
const opCache: Map<ViewTemplate, Op[]> = new Map();

interface Visitor {
    visit?: (node: DefaultTreeNode) => void;
    leave?: (node: DefaultTreeNode) => void;
}

declare module "parse5" {
    interface DefaultTreeElement {
        isDefinedCustomElement?: boolean;
    }
}

/**
 * Traverses a tree of nodes depth-first, invoking callbacks from visitor for each node as it goes.
 * @param node - the node to traverse
 * @param visitor - callbacks to be invoked during node traversal
 */
function traverse(node: DefaultTreeNode | DefaultTreeParentNode, visitor: Visitor) {
    if (visitor.visit) {
        visitor.visit(node);
    }

    if ("childNodes" in node) {
        const { childNodes } = node;
        for (const child of childNodes) {
            traverse(child, visitor);
        }
    }

    if (node.nodeName === "template") {
        traverse((node as any).content, visitor);
    }

    if (visitor.leave) {
        visitor.leave(node);
    }
}

/**
 * Test if a node is a comment node.
 * @param node - the node to test
 */
function isCommentNode(node: DefaultTreeNode): node is DefaultTreeCommentNode {
    return node.nodeName === "#comment";
}

/**
 * Test if a node is a text node.
 * @param node - the node to test
 */
function isTextNode(node: DefaultTreeNode): node is DefaultTreeTextNode {
    return node.nodeName === "#text";
}

/**
 * Test if a node is an element node
 * @param node - the node to test
 */
function isElementNode(node: DefaultTreeNode): node is DefaultTreeElement {
    return (node as DefaultTreeElement).tagName !== undefined;
}

/**
 * Parses a template into a set of operation instructions
 * @param template - The template to parse
 */
export function parseTemplateToOpCodes(template: ViewTemplate): Op[] {
    const cached: Op[] | undefined = opCache.get(template);
    if (cached !== undefined) {
        return cached;
    }

    const { html } = template;

    if (typeof html !== "string") {
        throw new Error(
            "@microsoft/fast-ssr only supports rendering a ViewTemplate with a string source."
        );
    }

    /**
     * Typescript thinks that `html` is a string | HTMLTemplateElement inside the functions defined
     * below, so store in a new var that is just a string type
     */
    const templateString = html;

    const codes = parseStringToOpCodes(templateString, template.factories);
    opCache.set(template, codes);
    return codes;
}

export function parseStringToOpCodes(
    templateString: string,
    factories: Record<string, ViewBehaviorFactory>
): Op[] {
    const nodeTree = parseFragment(templateString, { sourceCodeLocationInfo: true });

    if (!("nodeName" in nodeTree)) {
        // I'm not sure when exactly this is encountered but the type system seems to say it's possible.
        throw new Error(`Error parsing template`);
    }

    /**
     * Tracks the offset location in the source template string where the last
     * flushing / skip took place.
     */
    let lastOffset: number | undefined = 0;

    /**
     * Collection of op codes
     */
    const opCodes: Op[] = [];

    /**
     * Parses an Element node, pushing all op codes for the element into
     * the collection of ops for the template
     * @param node - The element node to parse
     */
    function parseElementNode(node: DefaultTreeElement): void {
        // Track whether the opening tag of an element should be augmented.
        // All constructable custom elements will need to be augmented,
        // as well as any element with attribute bindings
        let augmentOpeningTag = false;
        const { tagName } = node;
        const ctor: typeof HTMLElement | undefined = customElements.get(node.tagName);
        node.isDefinedCustomElement = !!ctor;

        // Sort attributes by whether they're related to a binding or if they have
        // static value
        const attributes: {
            static: Map<string, string>;
            dynamic: Map<Attribute, AttributeBindingOp>;
        } = node.attrs.reduce(
            (prev, current) => {
                const parsed = Parser.parse(current.value, factories);
                if (parsed) {
                    const factory = Compiler.aggregate(parsed) as ViewBehaviorFactory &
                        Aspected;
                    // Guard against directives like children, ref, and slotted
                    if (factory.binding && factory.aspectType !== Aspect.content) {
                        prev.dynamic.set(current, {
                            type: OpType.attributeBinding,
                            binding: factory.binding,
                            aspect: factory.aspectType,
                            target: factory.targetAspect,
                            useCustomElementInstance: Boolean(
                                node.isDefinedCustomElement
                            ),
                        });
                    }
                } else {
                    prev.static.set(current.name, current.value);
                }

                return prev;
            },
            {
                static: new Map<string, string>(),
                dynamic: new Map<Attribute, AttributeBindingOp>(),
            }
        );

        // Emit a CustomElementOpenOp when the custom element is defined
        if (ctor !== undefined) {
            augmentOpeningTag = true;
            opCodes.push({
                type: OpType.customElementOpen,
                tagName,
                ctor,
                staticAttributes: attributes.static,
            });
        } else if (node.tagName === "template") {
            // Template elements need special handling due to the host directive behavior
            // when used as the root element in a custom element template
            // (https://www.fast.design/docs/fast-element/using-directives#host-directives).
            flushTo(node.sourceCodeLocation?.startTag.startOffset);
            opCodes.push({
                type: OpType.templateElementOpen,
                staticAttributes: attributes.static,
                dynamicAttributes: Array.from(attributes.dynamic.values()),
            });
            skipTo(node.sourceCodeLocation!.startTag.endOffset);
            return;
        }

        // Iterate attributes in-order so that codes can be pushed for dynamic attributes in-order.
        // All dynamic attributes will be rendered from an AttributeBindingOp. Additionally, When the
        // node is a custom element, all static attributes will be rendered via the CustomElementOpenOp,
        // so this code skips over static attributes in that case.
        for (const attr of node.attrs) {
            if (attributes.dynamic.has(attr)) {
                const location = node.sourceCodeLocation!.attrs[attr.name];
                const code = attributes.dynamic.get(attr)!;
                flushTo(location.startOffset);
                augmentOpeningTag = true;
                opCodes.push(code);
                skipTo(location.endOffset);
            } else if (!attributes.static.has(attr.name)) {
                // Handle interpolated directives like children, ref, and slotted
                const parsed = Parser.parse(attr.value, factories);
                if (parsed) {
                    const location = node.sourceCodeLocation!.attrs[attr.name];
                    const factory = Compiler.aggregate(parsed);
                    flushTo(location.startOffset);
                    opCodes.push({ type: OpType.viewBehaviorFactory, factory });
                    skipTo(location.endOffset);
                }
            } else if (node.isDefinedCustomElement) {
                const location = node.sourceCodeLocation!.attrs[attr.name];
                flushTo(location.startOffset);
                skipTo(location.endOffset);
            }
        }

        if (augmentOpeningTag && node.tagName !== "template") {
            if (ctor) {
                flushTo(node.sourceCodeLocation!.startTag.endOffset - 1);
                opCodes.push({ type: OpType.customElementAttributes });
                flush(">");
                skipTo(node.sourceCodeLocation!.startTag.endOffset);
            } else {
                flushTo(node.sourceCodeLocation!.startTag.endOffset);
            }
        }

        if (ctor !== undefined) {
            opCodes.push({ type: OpType.customElementShadow });
        }
    }

    /**
     * Flushes a string value to op codes
     * @param value - The value to flush
     */
    function flush(value: string): void {
        const last = opCodes[opCodes.length - 1];
        if (last?.type === OpType.text) {
            last.value += value;
        } else {
            opCodes.push({ type: OpType.text, value });
        }
    }

    /**
     * Flush template content from lastIndex to provided offset
     * @param offset - the offset to flush to
     */
    function flushTo(offset?: number) {
        if (lastOffset === undefined) {
            throw new Error(
                `Cannot flush template content from a  last offset that is ${typeof lastOffset}.`
            );
        }

        const prev = lastOffset;
        lastOffset = offset;
        const value = templateString.substring(prev, offset);

        if (value !== "") {
            flush(value);
        }
    }

    function skipTo(offset: number) {
        if (lastOffset === undefined) {
            throw new Error("Could not skip from an undefined offset");
        }
        if (offset < lastOffset) {
            throw new Error(`offset must be greater than lastOffset.
                offset: ${offset}
                lastOffset: ${lastOffset}
            `);
        }

        lastOffset = offset;
    }

    traverse(nodeTree, {
        visit(node: DefaultTreeNode): void {
            if (isCommentNode(node) || isTextNode(node)) {
                const parsed = Parser.parse(
                    (node as DefaultTreeCommentNode)?.data ||
                        (node as DefaultTreeTextNode).value,
                    factories
                );

                if (parsed) {
                    flushTo(node.sourceCodeLocation!.startOffset);
                    for (const part of parsed) {
                        if (typeof part === "string") {
                            flush(part);
                        } else {
                            opCodes.push({
                                type: OpType.viewBehaviorFactory,
                                factory: part,
                            });
                        }
                    }
                    skipTo(node.sourceCodeLocation!.endOffset);
                }
            } else if (isElementNode(node)) {
                parseElementNode(node);
            }
        },

        leave(node: DefaultTreeNode): void {
            if (isElementNode(node)) {
                if (node.isDefinedCustomElement) {
                    opCodes.push({ type: OpType.customElementClose });
                } else if (node.tagName === "template") {
                    flushTo(node.sourceCodeLocation?.endTag.startOffset);
                    opCodes.push({ type: OpType.templateElementClose });
                    skipTo(node.sourceCodeLocation!.endTag.endOffset);
                }
            }
        },
    });

    // Flush the remaining string content before returning op codes.
    flushTo();

    return opCodes;
}
