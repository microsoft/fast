/**
 * Determines if a node is a primitive JS type that React can render
 */
export function isPrimitiveReactNode(node: unknown): node is string | number {
    const nodeType: string = typeof node;
    return nodeType === "string" || nodeType === "number";
}
