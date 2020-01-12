export function canHaveStroke(node: NodeType): boolean {
    return ["FRAME", "GROUP", "INSTANCE"].includes(node);
}

export function canHaveFill(node: NodeType): boolean {
    return ["FRAME", "GROUP", "INSTANCE"].includes(node);
}

export function canHaveTextFill(node: NodeType): boolean {
    return node === "TEXT";
}
