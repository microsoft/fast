import { ColorRGBA64, parseColor } from "@microsoft/fast-colors";
import { PluginNode } from "../core/node";
import { RecipeTypes } from "../core/recipe-registry";
function isNodeType(type) {
    return node => node.type === type;
}
export const isDocumentNode = isNodeType("DOCUMENT");
export const isPageNode = isNodeType("PAGE");
export const isSliceNode = isNodeType("SLICE");
export const isFrameNode = isNodeType("FRAME");
export const isGroupNode = isNodeType("GROUP");
export const isComponentNode = isNodeType("COMPONENT");
export const isInstanceNode = isNodeType("INSTANCE");
export const isBooleanOperationNode = isNodeType("BOOLEAN_OPERATION");
export const isVectorNode = isNodeType("VECTOR");
export const isStarNode = isNodeType("STAR");
export const isLineNode = isNodeType("LINE");
export const isEllipseNode = isNodeType("ELLIPSE");
export const isPolygonNode = isNodeType("POLYGON");
export const isRectangleNode = isNodeType("RECTANGLE");
export const isTextNode = isNodeType("TEXT");
export function isSceneNode(node) {
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
    ].some(test => test(node));
}
export function canHaveChildren(node) {
    return [
        isDocumentNode,
        isPageNode,
        isFrameNode,
        isGroupNode,
        isBooleanOperationNode,
        isInstanceNode,
        isComponentNode,
    ].some(test => test(node));
}
export class FigmaPluginNode extends PluginNode {
    constructor(id) {
        super();
        const node = figma.getNodeById(id);
        if (node === null) {
            throw new Error(`Node of ID "${id} does not exist`);
        }
        this.node = node;
        this.id = id;
        this.type = node.type;
    }
    children() {
        if (canHaveChildren(this.node)) {
            const children = [];
            for (const child of this.node.children) {
                children.push(new FigmaPluginNode(child.id));
            }
            return children;
        } else {
            return [];
        }
    }
    supports() {
        return Object.keys(RecipeTypes)
            .concat("designSystem")
            .filter(key => {
                switch (key) {
                    case RecipeTypes.backgroundFills:
                    case RecipeTypes.strokeFills:
                    case RecipeTypes.cornerRadius:
                    case "designSystem":
                        return [
                            isFrameNode,
                            isRectangleNode,
                            isPolygonNode,
                            isStarNode,
                            isComponentNode,
                            isInstanceNode,
                        ].some(test => test(this.node));
                    case RecipeTypes.foregroundFills:
                        return isTextNode(this.node);
                    default:
                        return false;
                }
            });
    }
    paint(data) {
        switch (data.type) {
            case RecipeTypes.strokeFills:
            case RecipeTypes.backgroundFills:
            case RecipeTypes.foregroundFills:
                this.paintColor(data);
                break;
            case RecipeTypes.cornerRadius:
                this.paintCornerRadius(data);
                break;
            default:
                throw new Error(`Recipe could not be painted ${JSON.stringify(data)}`);
        }
    }
    parent() {
        const parent = this.node.parent;
        if (parent === null) {
            return null;
        }
        return new FigmaPluginNode(parent.id);
    }
    getEffectiveBackgroundColor() {
        let node = this.node;
        while (node !== null) {
            if (node.fills) {
                const fills = node.fills;
                if (Array.isArray(fills)) {
                    const paints = fills.filter(fill => fill.type === "SOLID");
                    /**
                     * TODO: how do we process multiple paints?
                     */
                    if (paints.length === 1) {
                        const parsed = ColorRGBA64.fromObject(paints[0].color);
                        if (parsed instanceof ColorRGBA64) {
                            return parsed;
                        }
                    }
                }
            }
            node = node.parent;
        }
        return new ColorRGBA64(1, 1, 1);
    }
    getPluginData(key) {
        try {
            return JSON.parse(this.node.getPluginData(key));
        } catch (e) {
            return key === "designSystem" ? {} : [];
        }
    }
    setPluginData(key, value) {
        let raw;
        try {
            raw = JSON.stringify(value);
        } catch (e) {
            raw = "";
        }
        this.node.setPluginData(key, raw);
    }
    paintColor(data) {
        const color = parseColor(data.value);
        if (color === null) {
            throw new Error(
                `The value "${data.value}" could not be converted to a ColorRGBA64`
            );
        }
        const colorObject = color.toObject();
        const paint = {
            type: "SOLID",
            visible: true,
            opacity: colorObject.a,
            blendMode: "NORMAL",
            color: {
                r: colorObject.r,
                g: colorObject.g,
                b: colorObject.b,
            },
        };
        switch (data.type) {
            case RecipeTypes.backgroundFills:
            case RecipeTypes.foregroundFills:
                this.node.fills = [paint];
                break;
            case RecipeTypes.strokeFills:
                this.node.strokes = [paint];
                break;
        }
    }
    paintCornerRadius(data) {
        this.node.cornerRadius = data.value;
    }
}
