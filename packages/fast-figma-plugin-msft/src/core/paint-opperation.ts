/**
 * Paint instructions for a node
 */
export class PaintOperation {
    // private id: string;
    // private types: ColorRecipeType[] = ["backgroundFill", "strokeFill", "textFill"];
    // constructor(nodeID: string, ...types: ColorRecipeType[]) {
    //     this.id = nodeID;
    //     if (types.length) {
    //         this.types = types;
    //     }
    // }
    // public paint(): void {
    //     const node = this.node;
    //     if (!!node) {
    //         this.types.forEach(this.paintProperty.bind(this, node));
    //     }
    // }
    // private get node(): BaseNode | null {
    //     return figma.getNodeById(this.id);
    // }
    // private paintProperty(node: BaseNode, type: ColorRecipeType): void {
    //     // TODO: why does a ColorRecipeType fail here?
    //     if (supports(node, type as any)) {
    //         const data = getPluginData(node, type);
    //         if (!!data) {
    //             const value = parseColor(data.value);
    //             if (value instanceof ColorRGBA64) {
    //                 paintNode(node, type as any, value); // TODO: Why does a ColorRecipeType fail here?
    //             }
    //         }
    //     }
    // }
}
