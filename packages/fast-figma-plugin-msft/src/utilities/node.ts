export function canHaveStroke(node: NodeType): boolean {
    return ["FRAME", "GROUP", "INSTANCE", "RECTANGLE"].includes(node);
}

// Currently these follow the same rules.
export const canHaveFill = canHaveStroke;

export function canHaveTextFill(node: NodeType): boolean {
    return node === "TEXT";
}
