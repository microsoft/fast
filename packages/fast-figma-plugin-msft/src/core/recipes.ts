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

export interface RecipeStore<T = string> {
    [key: string]: {
        resolver: DesignSystemResolver<T>;
        name: string;
    };
}

export const fillRecipes: RecipeStore = {
    accentFillRest: { resolver: accentFillRest, name: "Accent Fill" },
    accentFillLargeRest: { resolver: accentFillLargeRest, name: "Accent Contrast Fill" },
    neutralFillRest: { resolver: neutralFillRest, name: "Neutral Fill" },
    neutralFillCard: { resolver: neutralFillCard, name: "Neutral Card" },
    neutralFillInputRest: { resolver: neutralFillInputRest, name: "Neutral Input" },
    neutralFillStealthRest: { resolver: neutralFillStealthRest, name: "Neutral Stealth" },
    neutralFillToggleRest: { resolver: neutralFillToggleRest, name: "Neutral Toggle" },
    neutralLayerCard: { resolver: neutralLayerCard, name: "Flyout" },
    neutralLayerCardContainer: {
        resolver: neutralLayerCardContainer,
        name: "Card Container",
    },
    neutralLayerFloating: { resolver: neutralLayerFloating, name: "Floating" },
    neutralLayerL1: { resolver: neutralLayerL1, name: "L1" },
    neutralLayerL1Alt: { resolver: neutralLayerL1Alt, name: "L1 Alt" },
    neutralLayerL2: { resolver: neutralLayerL2, name: "L2" },
    neutralLayerL3: { resolver: neutralLayerL3, name: "L3" },
    neutralLayerL4: { resolver: neutralLayerL4, name: "L4" },
};

export const strokeRecipes: RecipeStore = {
    neutralFocus: { resolver: neutralFocus, name: "Focus" },
    neutralOutlineRest: { resolver: neutralOutlineRest, name: "Outline" },
};

export const textFillRecipes: RecipeStore = {
    neutralForegroundRest: { resolver: neutralForegroundRest, name: "Primary" },
    neutralForegroundHint: { resolver: neutralForegroundHint, name: "Secondary" },
    neutralForegroundHintLarge: {
        resolver: neutralForegroundHintLarge,
        name: "Secondary Large",
    },
    accentForegroundRest: { resolver: accentForegroundRest, name: "Accent" },
    accentForegroundLargeRest: {
        resolver: accentForegroundLargeRest,
        name: "Accent Large",
    },
    accentForegroundCut: { resolver: accentForegroundCut, name: "On Accent" },
    accentForegroundCutLarge: {
        resolver: accentForegroundCutLarge,
        name: "On Accent Large",
    },
    neutralForegroundToggle: { resolver: neutralForegroundToggle, name: "Toggle" },
    neutralForegroundToggleLarge: {
        resolver: neutralForegroundToggleLarge,
        name: "Toggle Large",
    },
};

export const cornerRadiusRecipe: RecipeStore<number> = {
    square: { resolver: () => 0, name: "Square" },
    control: { resolver: () => 2, name: "Control" },
    surface: { resolver: () => 4, name: "Surface" },
    illustration: { resolver: () => 8, name: "Illustration" },
    round: { resolver: () => 99999, name: "Round" },
};
