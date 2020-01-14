export function canHaveStroke(node: SceneNode): boolean {
    return ["FRAME", "GROUP", "INSTANCE", "RECTANGLE"].includes(node.type);
}

// Currently these follow the same rules.
export const canHaveFill = canHaveStroke;

export function canHaveTextFill(node: SceneNode): node is TextNode {
    return node.type === "TEXT";
}

/**
 * Returns the selected node if a single node is
 * selected, otherwise returns null
 */
export function getActiveNode(): SceneNode | null {
    const { selection }: typeof figma.currentPage = figma.currentPage;

    return selection.length === 1 ? selection[0] : null;
}

export function isSceneNode(node: BaseNode): node is SceneNode {
    return [
        "SLICE",
        "FRAME",
        "GROUP",
        "COMPONENT",
        "INSTANCE",
        "BOOLEAN_OPERATION",
        "VECTOR",
        "STAR",
        "LINE",
        "ELLIPSE",
        "POLYGON",
        "RECTANGLE",
        "TEXT",
    ].includes(node.type);
}
