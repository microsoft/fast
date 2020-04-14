import { ColorRGBA64, parseColor } from "@microsoft/fast-colors";
import { PluginNode, PluginNodeData } from "../core/node";
import { RecipeData, RecipeTypes } from "../core/recipe-registry";

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
): node is
    | DocumentNode
    | PageNode
    | FrameNode
    | GroupNode
    | BooleanOperationNode
    | InstanceNode
    | ComponentNode {
    return [
        isDocumentNode,
        isPageNode,
        isFrameNode,
        isGroupNode,
        isBooleanOperationNode,
        isInstanceNode,
        isComponentNode,
    ].some((test: (node: BaseNode) => boolean) => test(node));
}

export class FigmaPluginNode extends PluginNode {
    public id: string;
    public type: string;
    private node: BaseNode;
    constructor(id: string) {
        super();
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

    public supports(): Array<RecipeTypes | "designSystem"> {
        return Object.keys(RecipeTypes)
            .concat("designSystem")
            .filter((key: string) => {
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
                        ].some((test: (node: BaseNode) => boolean) => test(this.node));
                    case RecipeTypes.foregroundFills:
                        return isTextNode(this.node);
                    default:
                        return false;
                }
            }) as Array<RecipeTypes | "designSystem">;
    }

    public paint(data: RecipeData): void {
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

    public parent(): FigmaPluginNode | null {
        const parent = this.node.parent;

        if (parent === null) {
            return null;
        }

        return new FigmaPluginNode(parent.id);
    }

    public getEffectiveBackgroundColor(): ColorRGBA64 {
        let node: BaseNode | null = this.node;

        while (node !== null) {
            if ((node as GeometryMixin).fills) {
                const fills = (node as GeometryMixin).fills;

                if (Array.isArray(fills)) {
                    const paints: SolidPaint[] = fills.filter(
                        (fill: Paint) => fill.type === "SOLID"
                    );

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

    protected getPluginData<K extends keyof PluginNodeData>(key: K): PluginNodeData[K] {
        try {
            return JSON.parse(this.node.getPluginData(key as string));
        } catch (e) {
            return key === "designSystem" ? ({} as any) : [];
        }
    }

    protected setPluginData<K extends keyof PluginNodeData>(
        key: K,
        value: PluginNodeData[K]
    ): void {
        let raw: string;
        try {
            raw = JSON.stringify(value);
        } catch (e) {
            raw = "";
        }
        this.node.setPluginData(key, raw);
    }

    private paintColor(data: RecipeData): void {
        const color = parseColor(data.value);

        if (color === null) {
            throw new Error(
                `The value "${data.value}" could not be converted to a ColorRGBA64`
            );
        }

        const colorObject = color.toObject();
        const paint: SolidPaint = {
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
                (this.node as any).fills = [paint];
                break;
            case RecipeTypes.strokeFills:
                (this.node as any).strokes = [paint];
                break;
        }
    }

    private paintCornerRadius(data: RecipeData): void {
        (this.node as any).cornerRadius = data.value;
    }
}
