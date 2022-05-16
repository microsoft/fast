import {
    deserializeUINodes,
    FigmaController,
    PluginUISerializableNodeData,
} from "./figma/controller";

const controller = new FigmaController();

// Ignore invisible nodes for performance, which means if someone turns them back to visible they may need to run the plugin again.
figma.skipInvisibleInstanceChildren = true;

figma.showUI(__html__, {
    height: 600,
    width: 356,
});

/**
 * Displays a notification when running a function that takes some time.
 * @param callback The function to call
 */
function notifyProcessing(callback: () => void) {
    const notify = figma.notify("Processing design tokens", { timeout: Infinity });

    setTimeout(() => {
        try {
            callback();
        } catch (e) {
            console.error(e);
            figma.notify(e.message, { error: true });
        }

        notify.cancel();
    }, 0);
}

function handleSelection() {
    const nodes: readonly BaseNode[] = figma.currentPage.selection.length
        ? figma.currentPage.selection
        : Object.freeze([figma.currentPage]);

    notifyProcessing(() =>
        controller.setSelectedNodes(nodes.map((node: BaseNode): string => node.id))
    );
}

let lastSelectionTimeout: number = Number.NaN;

/**
 * Avoid extra processing when the selection is still changing.
 */
function debounceSelection() {
    if (!Number.isNaN(lastSelectionTimeout)) {
        clearTimeout(lastSelectionTimeout);
    }

    lastSelectionTimeout = setTimeout(() => {
        lastSelectionTimeout = Number.NaN;
        handleSelection();
    }, 1000);
}

figma.on("selectionchange", debounceSelection);

figma.ui.onmessage = (nodes: PluginUISerializableNodeData[]): void => {
    notifyProcessing(() => {
        const pluginNodes = deserializeUINodes(nodes);
        controller.handleMessage(pluginNodes);
    });
};

handleSelection();
