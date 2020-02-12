import { PluginNode, PluginNodeData } from "./core/node";
import { fillRecipes, RecipeStore, strokeRecipes, textFillRecipes } from "./core/recipes";
import { FigmaController } from "./figma/controller";
import { RecipeDefinition, RecipeTypes } from "./core/recipe-registry";
import { canHaveChildren, FigmaPluginNode, isInstanceNode } from "./figma/node";
import { MessageTypes, UIMessage } from "./core/messaging";

const controller = new FigmaController();

function friendlyName(str: string): string {
    const result = str.split(/([A-Z])/).reduce((prev, current, index) => {
        return index % 2 === 1 ? prev + " " + current : prev + current;
    });

    return result
        .charAt(0)
        .toUpperCase()
        .concat(result.slice(1));
}

function register(type: RecipeTypes, recipes: RecipeStore): void {
    Object.keys(recipes).forEach((key: string) => {
        const definition: RecipeDefinition = {
            id: key,
            name: friendlyName(key),
            type,
            evaluate: (node: PluginNode): string => {
                const parent = node.parent();
                const backgroundColor = parent
                    ? parent.getEffectiveBackgroundColor()
                    : node.getEffectiveBackgroundColor();

                return recipes[key]({
                    ...node.designSystem,
                    backgroundColor: backgroundColor.toStringHexRGB(),
                } as any);
            },
        };

        controller.recipeRegistry.register(definition);
    });
}

function syncInstanceWithMaster(target: InstanceNode): void {
    const source = target.masterComponent;

    function sync(_source: BaseNode, _target: BaseNode): void {
        const pluginDataKeys: Array<keyof PluginNodeData> = ["recipes", "designSystem"];
        pluginDataKeys.forEach(key => {
            _target.setPluginData(key, _source.getPluginData(key));
        });

        if (canHaveChildren(_source) && canHaveChildren(_target)) {
            _source.children.forEach((child, index) => {
                sync(child, _target.children[index]);
            });
        }
    }

    sync(source, target);

    // Invalidate the cache
    new FigmaPluginNode(target.id).invalidateDesignSystemCache();
}

/**
 * Register recipe types
 */
register(RecipeTypes.backgroundFills, fillRecipes);
register(RecipeTypes.foregroundFills, textFillRecipes);
register(RecipeTypes.strokeFills, strokeRecipes);

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

figma.ui.onmessage = (value: UIMessage): void => {
    if (value.type === MessageTypes.sync) {
        value.nodeIds
            .map(id => figma.getNodeById(id))
            .filter(isInstanceNode)
            .map(syncInstanceWithMaster);
    }

    controller.handleMessage(value);
};

controller.setSelectedNodes(
    figma.currentPage.selection.map((node: BaseNode): string => node.id)
);
