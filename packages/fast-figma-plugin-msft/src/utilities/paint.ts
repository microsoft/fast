import { ColorRecipeType } from "../color-recipies";
import {
    FillRecipeNode,
    getPluginData,
    PluginDataNode,
    StrokeRecipeNode,
    supports,
    TextFillRecipeNode,
} from "../plugin-data";
import { ColorRGBA64, parseColor } from "@microsoft/fast-colors";
import { debounce } from "lodash-es";

class Painter {
    private _queue: PaintOperation[] = [];

    constructor() {
        this.paint = debounce(this.paint, 30);
    }

    /**
     * Queues an operation to paint.
     * @param operation The paint operation to queue
     */
    public queue(operation: PaintOperation): () => void {
        this._queue.push(operation);

        return (): void => {
            this._queue.filter((op: PaintOperation) => op !== operation);
        };
    }

    /**
     * Paint all operations in the queue
     */
    public paint = (): void => {
        this._queue.forEach((operation: PaintOperation) => operation.paint());

        this._queue = [];
    };
}

export const painter = new Painter();

/**
 * Paint instructions for a node
 */
export class PaintOperation {
    private id: string;
    private types: ColorRecipeType[] = ["backgroundFill", "strokeFill", "textFill"];

    constructor(nodeID: string, ...types: ColorRecipeType[]) {
        this.id = nodeID;

        if (types.length) {
            this.types = types;
        }
    }

    public paint(): void {
        const node = this.node;

        if (!!node) {
            this.types.forEach(this.paintProperty.bind(this, node));
        }
    }

    private get node(): BaseNode | null {
        return figma.getNodeById(this.id);
    }

    private paintProperty(node: BaseNode, type: ColorRecipeType): void {
        // TODO: why does a ColorRecipeType fail here?
        if (supports(node, type as any)) {
            const data = getPluginData(node, type);

            if (!!data) {
                const value = parseColor(data.value);

                if (value instanceof ColorRGBA64) {
                    paintNode(node, type as any, value); // TODO: Why does a ColorRecipeType fail here?
                }
            }
        }
    }
}

/**
 * Applies color to a node, where what it paints depends on the ColorRecipeType
 */
function paintNode(
    node: FillRecipeNode,
    type: "backgroundFill",
    color: ColorRGBA64
): void;
function paintNode(node: StrokeRecipeNode, type: "strokeFill", color: ColorRGBA64): void;
function paintNode(node: TextFillRecipeNode, type: "textFill", color: ColorRGBA64): void;
function paintNode(
    node: PluginDataNode,
    type: ColorRecipeType,
    color: ColorRGBA64
): void {
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
    switch (type) {
        case "backgroundFill":
        case "textFill":
            node.fills = [paint];
            break;
        case "strokeFill":
            node.strokes = [paint];
            break;
    }
}
