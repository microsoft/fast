import { PluginNode, PluginNodeData } from "./core/node";
import {
    cornerRadiusRecipe,
    fillRecipes,
    RecipeStore,
    strokeRecipes,
    textFillRecipes,
} from "./core/recipes";
import { FigmaController } from "./figma/controller";
import { RecipeDefinition, RecipeTypes } from "./core/recipe-registry";
import { canHaveChildren, FigmaPluginNode, isInstanceNode } from "./figma/node";
import { MessageTypes, UIMessage } from "./core/messaging";

const controller = new FigmaController();

function registerColorRecipe(type: RecipeTypes, recipes: RecipeStore): void {
    Object.keys(recipes).forEach((key: string) => {
        const recipe = recipes[key];

        const definition: RecipeDefinition = {
            id: key,
            name: recipe.name,
            type,
            evaluate: (node: PluginNode): string => {
                const parent = node.parent();
                const backgroundColor = parent
                    ? parent.getEffectiveBackgroundColor()
                    : node.getEffectiveBackgroundColor();

                return recipe.resolver({
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
        pluginDataKeys.forEach((key: "recipes" | "designSystem") => {
            _target.setPluginData(key, _source.getPluginData(key));
        });

        if (canHaveChildren(_source) && canHaveChildren(_target)) {
            _source.children.forEach((child: any, index: number) => {
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
registerColorRecipe(RecipeTypes.backgroundFills, fillRecipes);
registerColorRecipe(RecipeTypes.foregroundFills, textFillRecipes);
registerColorRecipe(RecipeTypes.strokeFills, strokeRecipes);

Object.keys(cornerRadiusRecipe).forEach(key => {
    const recipe = cornerRadiusRecipe[key];

    const definition: RecipeDefinition = {
        id: key,
        name: recipe.name,
        type: RecipeTypes.cornerRadius,
        evaluate: (): number => {
            return recipe.resolver({} as any);
        },
    };

    controller.recipeRegistry.register(definition);
});
/**
 * Show UI on plugin launch
 */
figma.showUI(__html__, {
    height: 600,
    width: 356,
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
            .map((id: string) => figma.getNodeById(id))
            .filter(isInstanceNode)
            .map(syncInstanceWithMaster);
    }

    controller.handleMessage(value);
};

controller.setSelectedNodes(
    figma.currentPage.selection.map((node: BaseNode): string => node.id)
);
