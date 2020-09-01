import { PluginNode } from "./core/node";
import {
    cornerRadiusRecipe,
    fillRecipes,
    RecipeStore,
    strokeRecipes,
    textFillRecipes,
} from "./core/recipes";
import { FigmaController } from "./figma/controller";
import { RecipeDefinition, RecipeTypes } from "./core/recipe-registry";
import { UIMessage } from "./core/messaging";

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

figma.ui.onmessage = (message: UIMessage): void => {
    controller.handleMessage(message);
};

controller.setSelectedNodes(
    figma.currentPage.selection.map((node: BaseNode): string => node.id)
);
