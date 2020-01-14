export function canHaveStroke(node: NodeType): boolean {
    return ["FRAME", "GROUP", "INSTANCE", "RECTANGLE"].includes(node);
}

// Currently these follow the same rules.
export const canHaveFill = canHaveStroke;

export function canHaveTextFill(node: NodeType): boolean {
    return node === "TEXT";
}

/**
 * Returns the selected node if a single node is
 * selected, otherwise returns null
 */
export function getActiveNode(): SceneNode | null {
    const { selection }: typeof figma.currentPage = figma.currentPage;

    return selection.length === 1 ? selection[0] : null;
}
