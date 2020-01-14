import {
    accentFill,
    accentFillLarge,
    accentForeground,
    accentForegroundCut,
    accentForegroundCutLarge,
    accentForegroundLarge,
    DesignSystem,
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

/**
 * Functions to get recipe names.
 * The exported functions are async to prep for service-based recipes
 */
function recipeNamesFactory(names: string[]): () => Promise<string[]> {
    return (): Promise<string[]> => {
        return new Promise(
            (resolve: (names: string[]) => void): void => {
                resolve(names);
            }
        );
    };
}

/**
 * Functions to get the value of a recipe by name
 * The exported functions are async to prep for service-based recipes
 */
function getRecipeValueFactory(recipes: {
    [key: string]: DesignSystemResolver<string | SwatchFamily>;
}): (name: string, designSystem: DesignSystem) => Promise<string> {
    return (name: string, designSystem: DesignSystem): Promise<string> => {
        return new Promise(
            (resolve: (value: string) => void, reject: () => void): void => {
                if (recipes.hasOwnProperty(name) && typeof recipes[name] === "function") {
                    const value: string | SwatchFamily = recipes[name](designSystem);
                    resolve(typeof value === "string" ? value : value.rest); // TODO: this hardcodes a "rest" state for all recipes. We will eventually need to open this up
                } else {
                    reject();
                }
            }
        );
    };
}

export const getFillValue = getRecipeValueFactory(fillRecipes);
export const getStrokeValue = getRecipeValueFactory(strokeRecipes);
export const getTextFillValue = getRecipeValueFactory(textFillRecipes);

export const getFillRecipeNames = recipeNamesFactory(fillRecipeNames.concat());
export const getStrokeRecipeNames = recipeNamesFactory(strokeRecipeNames.concat());
export const getTextFillRecipeNames = recipeNamesFactory(textFillRecipeNames.concat());
