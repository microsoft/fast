import {
    deserializeUINodes,
    FigmaController,
    PluginUISerializableNodeData,
} from "./figma/controller";

const controller = new FigmaController();

figma.showUI(__html__, {
    height: 600,
    width: 356,
});

function handleSelection() {
    const nodes: readonly BaseNode[] = figma.currentPage.selection.length
        ? figma.currentPage.selection
        : Object.freeze([figma.currentPage]);

    // console.log("--------------------------------");
    // console.log("main.handleSelection - selected nodes", nodes);

    controller.setSelectedNodes(nodes.map((node: BaseNode): string => node.id));
}

figma.on("selectionchange", handleSelection);

figma.ui.onmessage = (nodes: PluginUISerializableNodeData[]): void => {
    const pluginNodes = deserializeUINodes(nodes);
    controller.handleMessage(pluginNodes);
};

handleSelection();
