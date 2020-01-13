import {
    accentFill,
    accentFillLarge,
    accentForeground,
    accentForegroundCut,
    accentForegroundCutLarge,
    accentForegroundLarge,
    DesignSystemResolver,
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
import { SwatchFamily } from "@microsoft/fast-components-styles-msft/dist/utilities/color/common";

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

const fillRecipeNames: string[] = Object.keys(fillRecipes);
const strokeRecipeNames: string[] = Object.keys(strokeRecipes);
const textFillRecipeNames: string[] = Object.keys(textFillRecipes);

function getRecipeFactory<
    T extends { [key: string]: DesignSystemResolver<string | SwatchFamily> }
>(
    recipes: T
): (name: keyof T | string) => DesignSystemResolver<string | SwatchFamily> | null {
    return (
        name: keyof T | string
    ): DesignSystemResolver<string | SwatchFamily> | null => {
        return recipes.hasOwnProperty(name) ? recipes[name] : null;
    };
}

/**
 * Functions to get recipe functions by name
 */
export const getFillRecipe = getRecipeFactory(fillRecipes);
export const getStrokeRecipe = getRecipeFactory(strokeRecipes);
export const getTextFillRecipe = getRecipeFactory(textFillRecipes);

/**
 * Functions to get recipe names.
 *
 * Each returns a new array to avoid exposing the original array to the rest of the application
 */
export const getFillRecipeNames = (): string[] => fillRecipeNames.concat();
export const getStrokeRecipeNames = (): string[] => strokeRecipeNames.concat();
export const getTextFillRecipeNames = (): string[] => textFillRecipeNames.concat();
