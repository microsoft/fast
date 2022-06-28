import { isDark, SwatchRGB } from "@fluentui/web-components";
import { ColorRGBA64, parseColor } from "@microsoft/fast-colors";
import {
    AppliedDesignTokens,
    AppliedRecipes,
    PluginNodeData,
    RecipeEvaluation,
} from "../core/model";
import { PluginNode } from "../core/node";
import { DesignTokenType } from "../core/ui/design-token-registry";
import { variantBooleanHelper } from "./utility";

function isNodeType<T extends BaseNode>(type: NodeType): (node: BaseNode) => node is T {
    return (node: BaseNode): node is T => node.type === type;
}

export const isDocumentNode = isNodeType<DocumentNode>("DOCUMENT");
export const isPageNode = isNodeType<PageNode>("PAGE");
export const isSliceNode = isNodeType<SliceNode>("SLICE");
export const isFrameNode = isNodeType<FrameNode>("FRAME");
export const isGroupNode = isNodeType<GroupNode>("GROUP");
export const isComponentNode = isNodeType<ComponentNode>("COMPONENT");
export const isComponentSetNode = isNodeType<ComponentNode>("COMPONENT_SET");
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
        isComponentSetNode,
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
    | ComponentNode
    | ComponentSetNode {
    return [
        isDocumentNode,
        isPageNode,
        isFrameNode,
        isGroupNode,
        isBooleanOperationNode,
        isInstanceNode,
        isComponentNode,
        isComponentSetNode,
    ].some((test: (node: BaseNode) => boolean) => test(node));
}

export class FigmaPluginNode extends PluginNode {
    public id: string;
    public type: string;
    private node: BaseNode;

    constructor(node: BaseNode) {
        super();

        // Controller.nodeCount++;

        // console.log("  new FigmaPluginNode", node.id, node.name, node);

        this.node = node;
        this.id = node.id;
        this.type = node.type;

        this.loadLocalDesignTokens();
        this.loadRecipes();
        this.loadRecipeEvaluations();

        // If it's an instance node, the `recipes` may also include main component settings. Deduplicate them.
        if (isInstanceNode(this.node)) {
            const mainComponentNode = (this.node as InstanceNode).mainComponent;
            if (mainComponentNode) {
                this.deduplicateComponentDesignTokens(mainComponentNode);
                this.deduplicateComponentRecipes(mainComponentNode);
            }
        }

        // if (this._recipes.size) {
        //     console.log("    final recipes", this._recipes.serialize());
        // }

        // TODO This isn't working and is causing a lot of token evaluation issues. It would be nice if _some_ layers
        // in the design tool could have a fixed color and provide that to the tokens, but the logic for _which_
        // layers turns out to be pretty complicated.
        // For now the requirement is basing the adaptive design with a "layer" recipe.
        // this.setupFillColor();
    }

    private deduplicateComponentDesignTokens(node: BaseNode) {
        this._componentDesignTokens = new AppliedDesignTokens();
        const componentDesignTokensJson = node.getSharedPluginData(
            "fast",
            "designTokens"
        );
        this._componentDesignTokens.deserialize(componentDesignTokensJson);

        this._componentDesignTokens.forEach((token, tokenId) => {
            this._localDesignTokens.delete(tokenId);
        });
    }

    private deduplicateComponentRecipes(node: BaseNode) {
        this._componentRecipes = new AppliedRecipes();
        const componentRecipesJson = node.getSharedPluginData("fast", "recipes");
        this._componentRecipes.deserialize(componentRecipesJson);

        this._componentRecipes.forEach((recipe, recipeId) => {
            this._recipes.delete(recipeId);
        });
    }

    public canHaveChildren(): boolean {
        return canHaveChildren(this.node);
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
                    return [
                        isDocumentNode,
                        isPageNode,
                        isFrameNode,
                        isRectangleNode,
                        isEllipseNode,
                        isPolygonNode,
                        isStarNode,
                        isBooleanOperationNode,
                        isVectorNode,
                        isComponentNode,
                        isInstanceNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this.node));
                case DesignTokenType.strokeFill:
                case DesignTokenType.strokeWidth:
                    return [
                        isFrameNode,
                        isRectangleNode,
                        isEllipseNode,
                        isPolygonNode,
                        isStarNode,
                        isLineNode,
                        isVectorNode,
                        isComponentNode,
                        isInstanceNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this.node));
                case DesignTokenType.cornerRadius:
                    return [
                        isFrameNode,
                        isRectangleNode,
                        isEllipseNode,
                        isPolygonNode,
                        isStarNode,
                        isComponentNode,
                        isInstanceNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this.node));
                case DesignTokenType.foregroundFill:
                    return [
                        isFrameNode,
                        isRectangleNode,
                        isEllipseNode,
                        isPolygonNode,
                        isLineNode,
                        isStarNode,
                        isBooleanOperationNode,
                        isVectorNode,
                        isComponentNode,
                        isInstanceNode,
                        isTextNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this.node));
                case DesignTokenType.fontName:
                case DesignTokenType.fontSize:
                case DesignTokenType.lineHeight:
                    return isTextNode(this.node);
                case DesignTokenType.designToken:
                    return true;
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
            case DesignTokenType.strokeWidth:
                this.paintStrokeWidth(data);
                break;
            case DesignTokenType.cornerRadius:
                this.paintCornerRadius(data);
                break;
            case DesignTokenType.fontName:
                {
                    // TODO Handle font list better and font weight
                    const families = data.value.split(",");
                    const fontName = { family: families[0], style: "Regular" };
                    figma.loadFontAsync(fontName).then(x => {
                        (this.node as TextNode).fontName = fontName;
                    });
                }
                break;
            case DesignTokenType.fontSize:
                {
                    const textNode = this.node as TextNode;
                    figma.loadFontAsync(textNode.fontName as FontName).then(x => {
                        textNode.fontSize = Number.parseFloat(data.value);
                    });
                }
                break;
            case DesignTokenType.lineHeight:
                {
                    const textNode = this.node as TextNode;
                    figma.loadFontAsync(textNode.fontName as FontName).then(x => {
                        textNode.lineHeight = {
                            value: Number.parseFloat(data.value),
                            unit: "PIXELS",
                        };
                    });
                }
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
                        (fill: Paint) => fill.type === "SOLID" && fill.visible
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

    public handleManualDarkMode(): boolean {
        if (isInstanceNode(this.node)) {
            if (this.node.variantProperties) {
                const currentDarkMode = this.node.variantProperties["Dark mode"];
                if (currentDarkMode) {
                    const color = this.getEffectiveFillColor();
                    if (color) {
                        const containerIsDark = isDark(SwatchRGB.from(color));
                        // console.log("handleManualDarkMode", this.node.variantProperties['Dark mode'], "color", color.toStringHexRGB(), "dark", containerIsDark);
                        this.node.setProperties({
                            "Dark mode": variantBooleanHelper(currentDarkMode)(
                                containerIsDark
                            ),
                        });
                        return true;
                    }
                }
            }
        }

        return false;
    }

    protected getPluginData<K extends keyof PluginNodeData>(key: K): string | undefined {
        let value: string | undefined = this.node.getSharedPluginData(
            "fast",
            key as string
        );
        if (value === "") {
            value = undefined;
        }
        // console.log("    getPluginData", this.node.id, this.node.type, key, value);
        return value;
    }

    protected setPluginData<K extends keyof PluginNodeData>(key: K, value: string): void {
        // console.log("    setPluginData", this.node.id, this.node.type, key, value);
        this.node.setSharedPluginData("fast", key, value);
    }

    protected deletePluginData<K extends keyof PluginNodeData>(key: K): void {
        // console.log("    deletePluginData", this.node.id, this.node.type, key);
        this.node.setSharedPluginData("fast", key, "");
    }

    private paintColor(data: RecipeEvaluation): void {
        let paint: Paint | null = null;

        if (data.value.startsWith("linear-gradient")) {
            const linearMatch = /linear-gradient\((?<params>.+)\)/;
            const matches = data.value.match(linearMatch);
            if (matches && matches.groups) {
                const array = matches.groups.params.split(",").map(p => p.trim());

                let degrees: number = 90;
                if (array[0].endsWith("deg")) {
                    const angle = array.shift()?.replace("deg", "") || "90";
                    degrees = Number.parseFloat(angle);
                }
                const radians: number = degrees * (Math.PI / 180);

                const paramMatch = /(?<color>#[\w\d]+)( (?<pos>.+))?/;
                const stops = array.map((p, index, array) => {
                    const paramMatches = p.match(paramMatch);
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const color = parseColor(paramMatches?.groups?.color || "FF00FF")!;
                    let position: number = 0;
                    if (paramMatches?.groups && paramMatches?.groups?.pos) {
                        if (paramMatches.groups.pos.endsWith("%")) {
                            position = Number.parseFloat(paramMatches.groups.pos) / 100;
                        } else if (paramMatches.groups.pos.startsWith("calc(100% - ")) {
                            const px = Number.parseFloat(
                                paramMatches.groups.pos
                                    .replace("calc(100% - ", "")
                                    .replace("px)", "")
                            );
                            const size =
                                degrees === 90 || degrees === 270
                                    ? (this.node as LayoutMixin).height
                                    : (this.node as LayoutMixin).width;
                            position = (size - px) / size;
                        }
                    } else if (index === array.length - 1) {
                        position = 1;
                    }
                    const stop: ColorStop = {
                        position,
                        color: {
                            r: color.r,
                            g: color.g,
                            b: color.b,
                            a: color.a,
                        },
                    };
                    return stop;
                });

                const gradientPaint: GradientPaint = {
                    type: "GRADIENT_LINEAR",
                    gradientStops: stops,
                    gradientTransform: [
                        [Math.cos(radians), Math.sin(radians), 0],
                        [Math.sin(radians) * -1, Math.cos(radians), 1],
                    ],
                };
                paint = gradientPaint;
            }
        } else {
            // Assume it's solid
            const color = parseColor(data.value);

            if (color === null) {
                throw new Error(
                    `The value "${data.value}" could not be converted to a ColorRGBA64`
                );
            }

            const colorObject = color.toObject();
            const solidPaint: SolidPaint = {
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
            paint = solidPaint;
        }

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

    private paintStrokeWidth(data: RecipeEvaluation): void {
        (this.node as any).strokeWeight = Number.parseFloat(data.value);
    }

    private paintCornerRadius(data: RecipeEvaluation): void {
        (this.node as any).cornerRadius = data.value;
    }
}
