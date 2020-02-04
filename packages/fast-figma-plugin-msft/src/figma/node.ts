import { PluginNode, PluginNodeData } from "../core/node";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { RecipeTypes } from "../core/recipes";

function isNodeType<T extends BaseNode>(type: NodeType): (node: BaseNode) => node is T {
    return (node: BaseNode): node is T => node.type === type;
}

export const isDocumentNode = isNodeType<DocumentNode>("DOCUMENT");
export const isPageNode = isNodeType<PageNode>("PAGE");
export const isSliceNode = isNodeType<SliceNode>("SLICE");
export const isFrameNode = isNodeType<FrameNode>("FRAME");
export const isGroupNode = isNodeType<GroupNode>("GROUP");
export const isComponentNode = isNodeType<ComponentNode>("COMPONENT");
export const isInstanceNode = isNodeType<InstanceNode>("INSTANCE");
export const isBooleanOperationNode = isNodeType<BooleanOperationNode>(
    "BOOLEAN_OPERATION"
);
export const isVectorNode = isNodeType<VectorNode>("VECTOR");
export const isStarNode = isNodeType<StarNode>("STAR");
export const isLineNode = isNodeType<LineNode>("LINE");
export const isEllipseNode = isNodeType<EllipseNode>("ELLIPSE");
export const isPolygonNode = isNodeType<PolygonNode>("POLYGON");
export const isRectangleNode = isNodeType<RectangleNode>("RECTANGLE");
export const isTextNode = isNodeType<TextNode>("TEXT");

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

export class FigmaPluginNode implements PluginNode {
    public id: string;
    public type: string;
    private node: BaseNode;
    constructor(id: string) {
        const node = figma.getNodeById(id);

        if (node === null) {
            throw new Error(`Node of ID "${id} does not exist`);
        }

        this.node = node;
        this.id = id;
        this.type = node.type;
    }

    public children(): FigmaPluginNode[] {
        if (canHaveChildren(this.node)) {
            const children: FigmaPluginNode[] = [];

            for (const child of this.node.children) {
                children.push(new FigmaPluginNode(child.id));
            }

            return children;
        } else {
            return [];
        }
    }

    public getPluginData<K extends keyof PluginNodeData>(key: K): PluginNodeData[K] {
        try {
            return JSON.parse(this.node.getPluginData(key as string));
        } catch (e) {
            return key === "designSystem" ? ({} as any) : []; // Why does keyof not work here?!
        }
    }

    public setPluginData<K extends keyof PluginNodeData>(
        key: K,
        value: PluginNodeData[K]
    ): void {
        // let raw: string;
        // try {
        //     raw = JSON.stringify(value);
        // } catch (e) {
        //     raw = "";
        // }
        // this.node.setPluginData(key, raw);
    }

    public supports(): Array<keyof typeof RecipeTypes> {
        return Object.keys(RecipeTypes).filter(key => {
            switch (key) {
                case RecipeTypes.backgroundFills:
                case RecipeTypes.strokeFills:
                    return [
                        isFrameNode,
                        isRectangleNode,
                        isPolygonNode,
                        isStarNode,
                        isComponentNode,
                        isInstanceNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this.node));
                case RecipeTypes.foregroundFills:
                    return isTextNode(this.node);
                default:
                    return false;
            }
        }) as Array<keyof typeof RecipeTypes>;
    }

    public designSystem(): DesignSystem {
        return {} as any;
    }
}
