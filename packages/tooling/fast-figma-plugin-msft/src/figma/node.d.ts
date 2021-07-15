/// <reference types="figma" />
import { ColorRGBA64 } from "@microsoft/fast-colors";
import { PluginNode, PluginNodeData } from "../core/node";
import { RecipeData, RecipeTypes } from "../core/recipe-registry";
export declare const isDocumentNode: (node: BaseNode) => node is DocumentNode;
export declare const isPageNode: (node: BaseNode) => node is PageNode;
export declare const isSliceNode: (node: BaseNode) => node is SliceNode;
export declare const isFrameNode: (node: BaseNode) => node is FrameNode;
export declare const isGroupNode: (node: BaseNode) => node is GroupNode;
export declare const isComponentNode: (node: BaseNode) => node is ComponentNode;
export declare const isInstanceNode: (node: BaseNode) => node is InstanceNode;
export declare const isBooleanOperationNode: (
    node: BaseNode
) => node is BooleanOperationNode;
export declare const isVectorNode: (node: BaseNode) => node is VectorNode;
export declare const isStarNode: (node: BaseNode) => node is StarNode;
export declare const isLineNode: (node: BaseNode) => node is LineNode;
export declare const isEllipseNode: (node: BaseNode) => node is EllipseNode;
export declare const isPolygonNode: (node: BaseNode) => node is PolygonNode;
export declare const isRectangleNode: (node: BaseNode) => node is RectangleNode;
export declare const isTextNode: (node: BaseNode) => node is TextNode;
export declare function isSceneNode(node: BaseNode): node is SceneNode;
export declare function canHaveChildren(
    node: BaseNode
): node is
    | DocumentNode
    | PageNode
    | FrameNode
    | GroupNode
    | BooleanOperationNode
    | InstanceNode
    | ComponentNode;
export declare class FigmaPluginNode extends PluginNode {
    id: string;
    type: string;
    private node;
    constructor(id: string);
    children(): FigmaPluginNode[];
    supports(): Array<RecipeTypes | "designSystem">;
    paint(data: RecipeData): void;
    parent(): FigmaPluginNode | null;
    getEffectiveBackgroundColor(): ColorRGBA64;
    protected getPluginData<K extends keyof PluginNodeData>(key: K): PluginNodeData[K];
    protected setPluginData<K extends keyof PluginNodeData>(
        key: K,
        value: PluginNodeData[K]
    ): void;
    private paintColor;
    private paintCornerRadius;
}
