import {
    accentFillLargeRest,
    accentFillRest,
    accentForegroundCut,
    accentForegroundCutLarge,
    accentForegroundLargeRest,
    accentForegroundRest,
    DesignSystemResolver,
    neutralFillCard,
    neutralFillInputRest,
    neutralFillRest,
    neutralFillStealthRest,
    neutralFillToggleRest,
    neutralFocus,
    neutralForegroundHint,
    neutralForegroundHintLarge,
    neutralForegroundRest,
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
    neutralOutlineRest,
} from "@microsoft/fast-components-styles-msft";

export interface RecipeStore {
    [key: string]: DesignSystemResolver<string>;
}

export const fillRecipes: RecipeStore = {
    accentFillRest,
    accentFillLargeRest,
    neutralFillRest,
    neutralFillCard,
    neutralFillInputRest,
    neutralFillStealthRest,
    neutralFillToggleRest,
    neutralLayerCard,
    neutralLayerCardContainer,
    neutralLayerFloating,
    neutralLayerL1,
    neutralLayerL1Alt,
    neutralLayerL2,
    neutralLayerL3,
    neutralLayerL4,
};

export const strokeRecipes: RecipeStore = {
    neutralFocus,
    neutralOutlineRest,
};

export const textFillRecipes: RecipeStore = {
    accentForegroundRest,
    accentForegroundLargeRest,
    accentForegroundCut,
    accentForegroundCutLarge,
    neutralForegroundRest,
    neutralForegroundHint,
    neutralForegroundHintLarge,
    neutralForegroundToggle,
    neutralForegroundToggleLarge,
};
