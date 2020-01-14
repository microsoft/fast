import { ColorRGBA64 } from "@microsoft/fast-colors";

export function canHaveStroke(node: SceneNode): boolean {
    return ["FRAME", "RECTANGLE", "POLYGON", "STAR"].includes(node.type);
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

/**
 * Sets the fill of a node to a color.
 * TODO: Figma can have multiple fills - what should happen if there are multiple? Clobber completely for now.
 *
 * note: Groups have a behavior where a background is supplied to it's children. Limit this for now
 */
export function setFill<T extends GeometryMixin>(node: T, color: ColorRGBA64): void {
    const colorObject = color.toObject();
    node.fills = [
        {
            type: "SOLID",
            visible: true,
            opacity: colorObject.a,
            blendMode: "NORMAL",
            color: {
                r: colorObject.r,
                g: colorObject.g,
                b: colorObject.b,
            },
        },
    ];
}

/**
 * Sets the fill of a node to a color.
 * TODO: Figma can have multiple fills - what should happen if there are multiple? Clobber completely for now.
 *
 * note: Groups have a behavior where a background is supplied to it's children. Limit this for now
 */
export function setStroke<T extends GeometryMixin>(node: T, color: ColorRGBA64): void {
    const colorObject = color.toObject();
    node.strokes = [
        {
            type: "SOLID",
            visible: true,
            opacity: colorObject.a,
            blendMode: "NORMAL",
            color: {
                r: colorObject.r,
                g: colorObject.g,
                b: colorObject.b,
            },
        },
    ];
}
