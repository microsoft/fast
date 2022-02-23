/**
 * This code is largely a fork of lit's rendering implementation: https://github.com/lit/lit/blob/main/packages/labs/ssr/src/lib/render-lit-html.ts
 * with changes as necessary to render FAST components. A big thank you to those who contributed to lit's code above.
 */
import {
    ViewTemplate,
    AspectedHTMLDirective,
    HTMLDirective,
    DOM,
} from "@microsoft/fast-element";
import {
    DefaultTreeCommentNode,
    DefaultTreeDocumentFragment,
    DefaultTreeElement,
    DefaultTreeNode,
    DefaultTreeParentNode,
    DefaultTreeTextNode,
    parseFragment,
    CommentNode,
} from "parse5";
import { Op, OpType } from "./op-codes.js";
import {
    isInterpolationMarker,
    isMarkerComment,
    extractInterpolationMarkerId,
} from "./marker.js";

const opCache: Map<ViewTemplate, Op[]> = new Map();

interface Visitor {
    visit?: (node: DefaultTreeNode) => void;
    leave?: (node: DefaultTreeNode) => void;
    complete?: () => void;
}

// Will be 0 when starting and ending traversal.
let counter = 0;
/**
 * Traverses a tree of nodes depth-first, invoking callbacks from visitor for each node as it goes.
 * @param node - the node to traverse
 * @param visitor - callbacks to be invoked during node traversal
 */
function traverse(node: DefaultTreeNode | DefaultTreeParentNode, visitor: Visitor) {
    counter++;
    if (visitor.visit) {
        visitor.visit(node);
    }

    if ("childNodes" in node) {
        const { childNodes } = node;
        for (const child of childNodes) {
            traverse(child, visitor);
        }
    }

    if (visitor.leave) {
        visitor.leave(node);
    }

    counter--;

    if (counter === 0 && visitor.complete) {
        visitor.complete();
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
 * Test if a node is a document fragment node.
 * @param node - the node to test
 */
function isDocumentFragment(node: DefaultTreeNode): node is DefaultTreeDocumentFragment {
    return node.nodeName === "#document-fragment";
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

class TemplateParser implements Visitor {
    private lastOffset: number | undefined = 0;
    private get lastOp() {
        return this.opCodes[this.opCodes.length - 1];
    }

    constructor(private template: string, private directives: readonly HTMLDirective[]) {}

    public readonly opCodes: Op[] = [];
    public visit(node: DefaultTreeNode): void {
        if (this.isInterpolationMarkerNode(node) || this.isCommentMarkerNode(node)) {
            this.flushTo(node.sourceCodeLocation.startOffset);

            // TODO: clean this up when new APIs from fast-element get integrated.
            const directive = this.directives[
                this.isInterpolationMarkerNode(node)
                    ? extractInterpolationMarkerId(node)!
                    : DOM.extractDirectiveIndexFromMarker((node as unknown) as Comment)
            ];
            if (directive instanceof AspectedHTMLDirective) {
                this.opCodes.push({ type: OpType.directive, directive });
            } else {
                throw new Error(
                    `Unexpected directive type encountered. It is a ${directive}.`
                );
            }
            this.skipTo(node.sourceCodeLocation.endOffset);
        }
    }

    public leave(node: DefaultTreeNode): void {}
    public complete() {
        this.flushTo();
    }

    /**
     * Flushes a string value to op codes
     * @param value - The value to flush
     */
    private flush(value: string): void {
        const last = this.lastOp;
        if (last?.type === OpType.text) {
            last.value += value;
        } else {
            this.opCodes.push({ type: OpType.text, value });
        }
    }

    /**
     * Flush template content from lastIndex to provided offset
     * @param offset - the offset to flush to
     */
    private flushTo(offset?: number) {
        if (this.lastOffset === undefined) {
            throw new Error(
                `Cannot flush template content from a  last offset that is ${typeof this
                    .lastOffset}.`
            );
        }

        const prev = this.lastOffset;
        this.lastOffset = offset;
        const value = this.template.substring(prev, offset);

        if (value !== "") {
            this.flush(value);
        }
    }

    private skipTo(offset: number) {
        if (this.lastOffset === undefined) {
            throw new Error("Could not skip from an undefined offset");
        }
        if (offset < this.lastOffset) {
            throw new Error(`offset must be greater than lastOffset.
                offset: ${offset}
                lastOffset: ${this.lastOffset}
            `);
        }

        this.lastOffset = offset;
    }

    /**
     * Tests if a node is an interpolated FAST marker
     * @param node - the node to test
     */
    private isInterpolationMarkerNode(
        node: DefaultTreeNode
    ): node is Required<DefaultTreeTextNode> {
        return (
            isTextNode(node) &&
            node.sourceCodeLocation !== undefined &&
            isInterpolationMarker(node)
        );
    }

    /**
     * Tests if a node is a FAST comment marker
     * @param node - the node to test
     */
    private isCommentMarkerNode(
        node: DefaultTreeNode
    ): node is Required<DefaultTreeCommentNode> {
        return (
            isCommentNode(node) &&
            node.sourceCodeLocation !== undefined &&
            isMarkerComment(node)
        );
    }
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
            "@microsoft/fast-ssr does not support rendering a ViewTemplate with an HTMLTemplateElement html source."
        );
    }

    const ast = parseFragment(html, { sourceCodeLocationInfo: true });

    if (!("nodeName" in ast)) {
        // I'm not sure when exactly this is encountered but the type system seems to say it's possible.
        throw new Error(`Error parsing template:\n${template}`);
    }

    const ops: Op[] = [];
    const visitor = new TemplateParser(html, template.directives);
    opCache.set(template, visitor.opCodes);

    traverse(ast, visitor);

    return visitor.opCodes;
}
