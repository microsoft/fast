import { RecipeResolver } from "../core/recipe-resolver";

import {
    accentFill,
    accentFillLarge,
    accentForeground,
    accentForegroundCut,
    accentForegroundCutLarge,
    accentForegroundLarge,
    neutralFill,
    neutralFillCard,
    neutralFillInput,
    neutralFillStealth,
    neutralFillToggle,
    neutralFocus,
    neutralForeground,
    neutralForegroundHint,
    neutralForegroundHintLarge,
    neutralForegroundToggle,
    neutralForegroundToggleLarge,
    neutralLayerCard,
    neutralLayerCardContainer,
    neutralLayerFloating,
    neutralLayerL1,
    neutralLayerL1Alt,
    neutralLayerL2,
    neutralLayerL3,
    neutralLayerL4,
    neutralOutline,
} from "@microsoft/fast-components-styles-msft";
import { PluginNode } from "../core/node";
import { PluginUIPropsNodeRecipeOptions } from "../core/ui";
import { RecipeTypes } from "../core/recipes";

/**
 * Define the recipes that can be used. These are surfaced in
 * the plugin UI and can be assigned to a node.
 *
 * Recipes and recipe names are not exported so that their direct use
 * is not baked in around the application, which will facilitate
 * service-based calls when we do that work.
 */
const fillRecipes = {
    accentFill,
    accentFillLarge,
    neutralFill,
    neutralFillCard,
    neutralFillInput,
    neutralFillStealth,
    neutralFillToggle,
    neutralLayerCard,
    neutralLayerCardContainer,
    neutralLayerFloating,
    neutralLayerL1,
    neutralLayerL1Alt,
    neutralLayerL2,
    neutralLayerL3,
    neutralLayerL4,
};

const strokeRecipes = {
    neutralFocus,
    neutralOutline,
};

const textFillRecipes = {
    accentForeground,
    accentForegroundLarge,
    accentForegroundCut,
    accentForegroundCutLarge,
    neutralForeground,
    neutralForegroundHint,
    neutralForegroundHintLarge,
    neutralForegroundToggle,
    neutralForegroundToggleLarge,
};

export class FigmaRecipeResolver extends RecipeResolver {
    private recipesByType(type: RecipeTypes) {
        switch (type) {
            case RecipeTypes.backgroundFills:
                return fillRecipes;
            case RecipeTypes.foregroundFills:
                return textFillRecipes;
            case RecipeTypes.strokeFills:
                return strokeRecipes;
        }
    }
    public async recipeDataForNode(
        node: PluginNode
    ): Promise<PluginUIPropsNodeRecipeOptions> {
        const data = await Promise.all(
            node.recipeSupport().map(async type => {
                const recipes = this.recipesByType(RecipeTypes[type]);

                return {
                    [type]: await Promise.all(
                        Object.keys(recipes).map(async key => {
                            return {
                                name: key,
                                id: key,
                                value: recipes[key]({}), // TODO: node.designSystem
                            };
                        })
                    ),
                };
            })
        );

        return data as any;
    }
}
