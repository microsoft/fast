import { PluginNode } from "./core/node";
import { fillRecipes, RecipeStore, strokeRecipes, textFillRecipes } from "./core/recipes";
import { FigmaController } from "./figma/controller";
import { RecipeTypes, RecipeDefinition } from "./core/recipe-registry";

const controller = new FigmaController();

function register(type: RecipeTypes, recipes: RecipeStore): void {
    Object.keys(recipes).forEach((key: string) => {
        const defintion: RecipeDefinition = {
            id: key,
            name: key,
            type,
            apply: (node: PluginNode): void => {
                console.log("apply", key, "to", node.id);
            },
            evaluate: (node: PluginNode): string => {
                return recipes[key](node.designSystem());
            },
        };

        controller.recipeRegistry.register(defintion);
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
