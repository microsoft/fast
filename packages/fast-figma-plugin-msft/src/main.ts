import { FigmaContoller } from "./figma/controller";

const controller = new FigmaContoller();

/**
 * Show UI on plugin launch
 */
figma.showUI(__html__, {
    height: 600,
});

/**
 * If plugin is launched and no editable node is selected, all editing UI should be disabled
 * If node is editable, fields should be enabled. If there is a current selection then the
 *    the UI should be set to that by default
 */
figma.on("selectionchange", () => {
    controller.setSelectedNodes(
        figma.currentPage.selection.map((node: BaseNode): string => node.id)
    );
});

figma.ui.onmessage = (): void => controller.handleUIEvent();
