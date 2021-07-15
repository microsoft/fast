import {
    cornerRadiusRecipe,
    fillRecipes,
    strokeRecipes,
    textFillRecipes,
} from "./core/recipes";
import { FigmaController } from "./figma/controller";
import { RecipeTypes } from "./core/recipe-registry";
const controller = new FigmaController();
function registerColorRecipe(type, recipes) {
    Object.keys(recipes).forEach(key => {
        const recipe = recipes[key];
        const definition = {
            id: key,
            name: recipe.name,
            type,
            evaluate: node => {
                const parent = node.parent();
                const backgroundColor = parent
                    ? parent.getEffectiveBackgroundColor()
                    : node.getEffectiveBackgroundColor();
                return recipe.resolver(
                    Object.assign(Object.assign({}, node.designSystem), {
                        backgroundColor: backgroundColor.toStringHexRGB(),
                    })
                );
            },
        };
        controller.recipeRegistry.register(definition);
    });
}
/**
 * Register recipe types
 */
registerColorRecipe(RecipeTypes.backgroundFills, fillRecipes);
registerColorRecipe(RecipeTypes.foregroundFills, textFillRecipes);
registerColorRecipe(RecipeTypes.strokeFills, strokeRecipes);
Object.keys(cornerRadiusRecipe).forEach(key => {
    const recipe = cornerRadiusRecipe[key];
    const definition = {
        id: key,
        name: recipe.name,
        type: RecipeTypes.cornerRadius,
        evaluate: () => {
            return recipe.resolver({});
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
    controller.setSelectedNodes(figma.currentPage.selection.map(node => node.id));
});
figma.ui.onmessage = message => {
    controller.handleMessage(message);
};
controller.setSelectedNodes(figma.currentPage.selection.map(node => node.id));
