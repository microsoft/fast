/**
 * This code is largely a fork of lit's rendering implementation: https://github.com/lit/lit/blob/main/packages/labs/ssr/src/lib/render-lit-html.ts
 * with changes as necessary to render FAST components. A big thank you to those who contributed to lit's code above.
 */
import { DOM } from "@microsoft/fast-element";
import {
    DefaultTreeCommentNode,
    DefaultTreeDocumentFragment,
    DefaultTreeElement,
    DefaultTreeNode,
    DefaultTreeParentNode,
    DefaultTreeTextNode,
} from "parse5";

export function isCommentNode(node: DefaultTreeNode): node is DefaultTreeCommentNode {
    return node.nodeName === "#comment";
}

export function isDocumentFragment(
    node: DefaultTreeNode
): node is DefaultTreeDocumentFragment {
    return node.nodeName === "#document-fragment";
}

export function isTextNode(node: DefaultTreeNode): node is DefaultTreeTextNode {
    return node.nodeName === "#text";
}

export function isElementNode(node: DefaultTreeNode): node is DefaultTreeElement {
    return (node as DefaultTreeElement).tagName !== undefined;
}

type GetChildNodes = (node: DefaultTreeParentNode) => Array<DefaultTreeNode> | undefined;
const defaultChildNodes: GetChildNodes = (node: DefaultTreeParentNode) => node.childNodes;
interface Visitor {
    pre?: (node: DefaultTreeNode, parent?: DefaultTreeParentNode) => boolean | void;
    post?: (node: DefaultTreeNode, parent?: DefaultTreeParentNode) => boolean | void;
}

export function getLast<T>(set: T[]): T {
    return set[set.length - 1];
}

export function traverse(
    node: DefaultTreeNode,
    visitor: Visitor,
    parent?: DefaultTreeParentNode
): void {
    let visitChildren: boolean | void = true;

    if (typeof visitor.pre === "function") {
        visitChildren = visitor.pre(node, parent);
    }

    if (visitChildren !== false) {
        const childNodes = defaultChildNodes(node as DefaultTreeParentNode);
        if (childNodes !== undefined) {
            for (const child of childNodes) {
                traverse(child, visitor, node as DefaultTreeParentNode);
            }
        }
    }

    if (typeof visitor.post === "function") {
        visitor.post(node, parent);
    }
}

const blockMarker = new RegExp(`${DOM.marker}:\\d+`);
export function isMarkerComment(node: DefaultTreeCommentNode): boolean {
    return blockMarker.test(node.data);
}

const interpolationMarker = new RegExp(`${DOM.marker}\\{(?<id>\\d+)\\}${DOM.marker}`);
export function isInterpolationMarker(node: { value: string }): boolean {
    return interpolationMarker.test(node.value);
}

export function extractInterpolationMarkerId(node: { value: string }): number | null {
    const id = interpolationMarker.exec(node.value)?.groups?.id;

    return id === undefined ? null : parseInt(id, 10);
}
