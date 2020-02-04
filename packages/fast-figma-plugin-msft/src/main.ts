import { PluginNode } from "./core/node";
import {
    fillRecipes,
    RecipeStore,
    RecipeTypes,
    strokeRecipes,
    textFillRecipes,
} from "./core/recipes";
import { FigmaController } from "./figma/controller";

const controller = new FigmaController();

function register(category: string, recipes: RecipeStore): void {
    Object.keys(recipes).forEach((key: keyof RecipeStore) => {
        controller.recipeRegistry.register({
            id: key as string,
            name: key as string,
            categories: [category],
            evaluate: (node: PluginNode): string => {
                return recipes[key](node.designSystem());
            },
        });
    });
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

figma.ui.onmessage = (value): void => {
    // parse object
};
