import { ColorRGBA64, parseColor } from "@microsoft/fast-colors";
import { AppliedRecipes, PluginNodeData, RecipeEvaluation } from "../core/model";
import { PluginNode } from "../core/node";
import { DesignTokenType } from "../core/ui/design-token-registry";

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

    constructor(node: BaseNode) {
        super();

        // console.log("  new FigmaPluginNode", node.id, node.name, node);

        this.node = node;
        this.id = node.id;
        this.type = node.type;

        // Load all recipes attached to the node.
        const recipesJson = this.getPluginData("recipes");
        this._recipes.deserialize(recipesJson);

        // If it's an instance node, the `recipes` may also include main component settings. Deduplicate them.
        if (isInstanceNode(this.node)) {
            const mainNode = (this.node as InstanceNode).mainComponent;
            if (mainNode) {
                this._componentRecipes = new AppliedRecipes();
                const componentRecipesJson = mainNode.getPluginData("recipes");
                this._componentRecipes.deserialize(componentRecipesJson);

                this._componentRecipes.forEach((recipe, recipeId) => {
                    this._recipes.delete(recipeId)
                });
            }
        }

        if (this._recipes.size) {
            // console.log("    recipes", this._recipes.serialize());
        }
    }

    public children(): FigmaPluginNode[] {
        if (canHaveChildren(this.node)) {
            const children: FigmaPluginNode[] = [];

            // console.log("  get children");
            for (const child of this.node.children) {
                children.push(new FigmaPluginNode(child));
            }

            return children;
        } else {
            return [];
        }
    }

    public supports(): Array<DesignTokenType> {
        return Object.keys(DesignTokenType).filter((key: string) => {
            switch (key) {
                case DesignTokenType.layerFill:
                case DesignTokenType.backgroundFill:
                case DesignTokenType.strokeFill:
                case DesignTokenType.cornerRadius:
                case DesignTokenType.designToken:
                    return [
                        (node: BaseNode) =>
                            isDocumentNode(node) && key === DesignTokenType.designToken,
                        (node: BaseNode) =>
                            isPageNode(node) &&
                            (key === DesignTokenType.designToken ||
                                key === DesignTokenType.backgroundFill),
                        isFrameNode,
                        isRectangleNode,
                        isPolygonNode,
                        isStarNode,
                        isComponentNode,
                        isInstanceNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this.node));
                case DesignTokenType.foregroundFill:
                    return isTextNode(this.node);
                default:
                    return false;
            }
        }) as Array<DesignTokenType>;
    }

    public paint(data: RecipeEvaluation): void {
        switch (data.type) {
            case DesignTokenType.strokeFill:
            case DesignTokenType.layerFill:
            case DesignTokenType.backgroundFill:
            case DesignTokenType.foregroundFill:
                this.paintColor(data);
                break;
            case DesignTokenType.cornerRadius:
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

        // console.log("  get parent");
        return new FigmaPluginNode(parent);
    }

    public getEffectiveFillColor(): ColorRGBA64 | null {
        let node: BaseNode | null = this.node;

        while (node !== null) {
            if ((node as GeometryMixin).fills) {
                const fills = (node as GeometryMixin).fills;

                if (Array.isArray(fills)) {
                    const paints: SolidPaint[] = fills.filter(
                        (fill: Paint) => fill.type === "SOLID"
                    );

                    // TODO: how do we process multiple paints?
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

        return null;
    }

    protected getPluginData<K extends keyof PluginNodeData>(key: K): string | undefined {
        let value: string | undefined = this.node.getPluginData(key as string);
        if (value === "") {
            value = undefined;
        }
        // console.log("    getPluginData", this.node.id, this.node.type, key, value);

        if (isInstanceNode(this.node)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const mainNode = (this.node as InstanceNode).mainComponent!;
            // console.log("    getPluginData", mainNode.id, mainNode.type, key, mainNode.getPluginData(key));
        }

        return value;
    }

    protected setPluginData<K extends keyof PluginNodeData>(key: K, value: string): void {
        // console.log("    setPluginData", this.node.id, this.node.type, key, value);
        this.node.setPluginData(key, value);
    }

    protected deletePluginData<K extends keyof PluginNodeData>(key: K): void {
        // console.log("    deletePluginData", this.node.id, this.node.type, key);
        this.node.setPluginData(key, "");
    }

    private paintColor(data: RecipeEvaluation): void {
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
            case DesignTokenType.layerFill:
            case DesignTokenType.backgroundFill:
            case DesignTokenType.foregroundFill:
                (this.node as any).fills = [paint];
                break;
            case DesignTokenType.strokeFill:
                (this.node as any).strokes = [paint];
                break;
        }
    }

    private paintCornerRadius(data: RecipeEvaluation): void {
        (this.node as any).cornerRadius = data.value;
    }
}
