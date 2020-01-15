import { ColorRGBA64 } from "@microsoft/fast-colors";

/**
 * Returns the selected node if a single node is
 * selected, otherwise returns null
 */
export function getActiveNode(): SceneNode | null {
    const { selection }: typeof figma.currentPage = figma.currentPage;

    return selection.length === 1 ? selection[0] : null;
}

/**
 * Strict type assertions for Figma nodes
 */
export function isDocumentNode(node: BaseNode): node is DocumentNode {
    return node.type === "DOCUMENT";
}

export function isPageNode(node: BaseNode): node is PageNode {
    return node.type === "PAGE";
}

export function isSliceNode(node: BaseNode): node is SliceNode {
    return node.type === "SLICE";
}

export function isFrameNode(node: BaseNode): node is FrameNode {
    return node.type === "FRAME";
}

export function isGroupNode(node: BaseNode): node is GroupNode {
    return node.type === "GROUP";
}

export function isComponentNode(node: BaseNode): node is ComponentNode {
    return node.type === "COMPONENT";
}

export function isInstanceNode(node: BaseNode): node is InstanceNode {
    return node.type === "INSTANCE";
}

export function isBooleanOperationNode(node: BaseNode): node is BooleanOperationNode {
    return node.type === "BOOLEAN_OPERATION";
}

export function isVectorNode(node: BaseNode): node is VectorNode {
    return node.type === "VECTOR";
}

export function isStarNode(node: BaseNode): node is StarNode {
    return node.type === "STAR";
}

export function isLineNode(node: BaseNode): node is LineNode {
    return node.type === "LINE";
}

export function isEllipseNode(node: BaseNode): node is EllipseNode {
    return node.type === "ELLIPSE";
}

export function isPolygonNode(node: BaseNode): node is PolygonNode {
    return node.type === "POLYGON";
}

export function isRectangleNode(node: BaseNode): node is RectangleNode {
    return node.type === "RECTANGLE";
}

export function isTextNode(node: BaseNode): node is TextNode {
    return node.type === "TEXT";
}

export function isSceneNode(node: BaseNode): node is SceneNode {
    return [
        isSliceNode,
        isFrameNode,
        isGroupNode,
        isComponentNode,
        isInstanceNode,
        isBooleanOperationNode,
        isVectorNode,
        isStarNode,
        isLineNode,
        isEllipseNode,
        isPolygonNode,
        isRectangleNode,
        isTextNode,
    ].some((test: (node: BaseNode) => boolean) => test(node));
}

export function canHaveChildren(
    node: BaseNode
): node is DocumentNode | PageNode | FrameNode | GroupNode | BooleanOperationNode {
    return [
        isDocumentNode,
        isPageNode,
        isFrameNode,
        isGroupNode,
        isBooleanOperationNode,
    ].some((test: (node: BaseNode) => boolean) => test(node));
}
