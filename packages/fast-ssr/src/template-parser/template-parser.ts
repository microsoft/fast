/**
 * This file was heavily inspired by {@link https://github.com/lit/lit/tree/main/packages/labs/ssr}, with adjustments to render parse FAST elements.
 * Please see {@link ../ACKNOWLEDGEMENTS.md}
 */
import {
    Aspected,
    Compiler,
    HTMLDirective,
    Parser,
    ViewBehaviorFactory,
    ViewTemplate,
} from "@microsoft/fast-element";
import { parse, parseFragment } from "parse5";
import {
    Attribute,
    DefaultTreeCommentNode,
    DefaultTreeElement,
    DefaultTreeNode,
    DefaultTreeParentNode,
    DefaultTreeTextNode,
} from "parse5/index.js";
import { TemplateCacheControllerImpl } from "../template-cache/controller.js";
import { AttributeBindingOp, OpCodes, OpType } from "./op-codes.js";

interface Visitor {
    visit?: (node: DefaultTreeNode) => void;
    leave?: (node: DefaultTreeNode) => void;
}

declare module "parse5/index.js" {
    interface DefaultTreeElement {
        isCustomElement?: boolean;
    }
}

/**
 * Traverses a tree of nodes depth-first, invoking callbacks from visitor for each node as it goes.
 * @param node - the node to traverse
 * @param visitor - callbacks to be invoked during node traversal
 */
function traverse(node: DefaultTreeNode | DefaultTreeParentNode, visitor: Visitor) {
    // Templates parsed with `parse()` are parsed as full documents and will contain
    // html, body tags whether the template contains them or not. Skip over visiting and
    // leaving these elements if there is no source-code location, because that indicates
    // they are not in the template string.
    const shouldVisit = !!(node as DefaultTreeElement).sourceCodeLocation;
    if (visitor.visit && shouldVisit) {
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

    if (visitor.leave && shouldVisit) {
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

function isDefaultTreeParentNode(node: any): node is DefaultTreeParentNode {
    return Array.isArray(node.childNodes);
}

function firstElementChild(node: DefaultTreeParentNode): DefaultTreeElement | null {
    return (
        (node.childNodes.find(child => isElementNode(child)) as
            | DefaultTreeElement
            | undefined) || null
    );
}
/**
 * https://html.spec.whatwg.org/dev/custom-elements.html#custom-elements-core-concepts
 * @internal
 */
export const customElementNameExcludeList = [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-src",
    "font-face-uri",
    "font-face-format",
    "font-face-name",
    "missing-glyph",
];

export const templateCacheController = TemplateCacheControllerImpl.create(OpCodes);

/**
 * Parses a template into a set of operation instructions
 * @param template - The template to parse
 */
export function parseTemplateToOpCodes(template: ViewTemplate): OpCodes {
    const cached = !templateCacheController.disabled && OpCodes.get(template);

    if (!!cached) {
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
    !templateCacheController.disabled && OpCodes.set(template, codes);
    return codes as OpCodes;
}

export function parseStringToOpCodes(
    /**
     * The string to parse
     */
    templateString: string,
    factories: Record<string, ViewBehaviorFactory>,

    /**
     * Adjust behavior when parsing a template used
     * as a custom element's template
     */
    forCustomElement = false
): OpCodes {
    const nodeTree = (forCustomElement ? parseFragment : parse)(templateString, {
        sourceCodeLocationInfo: true,
    });

    let factoryIndex = 0;

    if (!isDefaultTreeParentNode(nodeTree)) {
        // I'm not sure when exactly this is encountered but the type system seems to say it's possible.
        throw new Error(`Error parsing template`);
    }

    // TypeScript gets confused about what 'nodeTree' is.
    // Creating a new var clears that up.
    let tree = nodeTree as DefaultTreeParentNode;

    /**
     * Tracks the offset location in the source template string where the last
     * flushing / skip took place.
     */
    let lastOffset: number | undefined = 0;

    let finalOffset: number = templateString.length;

    /**
     * Collection of op codes
     */
    const opCodes = new OpCodes();

    let hostBindingTarget: null | DefaultTreeElement = null;
    let hydrationIndexOffset = 0;

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
        const ctor: typeof HTMLElement | undefined = customElements.get(tagName);
        const isCustomElement =
            tagName.includes("-") && !customElementNameExcludeList.includes(tagName);
        node.isCustomElement = isCustomElement;

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
                    prev.dynamic.set(current, {
                        type: OpType.attributeBinding,
                        factory: factory,
                        useCustomElementInstance: isCustomElement,
                        index: factoryIndex++,
                    });
                } else {
                    prev.static.set(current.name, current.value);

                    // FAST's client-side compile step adds factories for all
                    // host attributes, even if there is no data-binding. Increment
                    // the factoryIndex to account for that behavior
                    if (hostBindingTarget === node) {
                        factoryIndex++;
                    }
                }

                return prev;
            },
            {
                static: new Map<string, string>(),
                dynamic: new Map<Attribute, AttributeBindingOp>(),
            }
        );

        // Emit a CustomElementOpenOp when the custom element is defined
        if (isCustomElement) {
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
            if (node === hostBindingTarget) {
                hydrationIndexOffset = factoryIndex;
            }
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
            } else if (isCustomElement) {
                const location = node.sourceCodeLocation!.attrs[attr.name];
                flushTo(location.startOffset);
                skipTo(location.endOffset);
            }
        }

        if (augmentOpeningTag && node.tagName !== "template") {
            flushTo(node.sourceCodeLocation!.startTag.endOffset - 1);
            if (attributes.dynamic.size > 0) {
                opCodes.push({
                    type: OpType.attributeBindingMarker,
                    indexes: Array.from(attributes.dynamic.values()).map(
                        attr => attr.index
                    ),
                });
            }

            if (isCustomElement) {
                opCodes.push({ type: OpType.customElementAttributes });
                flush(">");
                skipTo(node.sourceCodeLocation!.startTag.endOffset);
            } else {
                flushTo(node.sourceCodeLocation!.startTag.endOffset);
            }
        }

        if (isCustomElement) {
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
    function flushTo(offset: number = finalOffset) {
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

    /**
     * FAST leverages any <template> element that is a firstElementChild
     * of the template as a binding target for any directives on the
     * <template>. This block implements that behavior.
     */
    if (forCustomElement) {
        const fec = firstElementChild(tree);

        if (fec !== null && fec.tagName === "template") {
            tree = fec as DefaultTreeParentNode;
            hostBindingTarget = fec;
            const location = fec.sourceCodeLocation!;
            finalOffset = location.endTag.endOffset;
            lastOffset = location.startTag.startOffset;
        }
    }

    traverse(tree, {
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
                            // There are cases where aspects are mis-assigned during template pre-compilation
                            // that are patched-up during by the complier prior to rendering client-side. Sometimes,
                            // that mis-assignment causes content bindings to be aspected as attribute bindings.
                            // If a text node has bindings, the aspect should always be content, so ensure the
                            // aspect is assigned accordingly
                            if (isTextNode(node)) {
                                HTMLDirective.assignAspect(
                                    part as ViewBehaviorFactory & Aspected
                                );
                            }

                            opCodes.push({
                                type: OpType.viewBehaviorFactory,
                                factory: part,
                                index: factoryIndex++,
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
                if (node.isCustomElement) {
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
    opCodes.hydrationIndexOffset = hydrationIndexOffset;

    return opCodes;
}
