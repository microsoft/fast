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
import { ColorRGBA64 } from "@microsoft/fast-colors";
import {
    FillRecipeNode,
    PluginDataNode,
    StrokeRecipeNode,
    TextFillRecipeNode,
} from "./plugin-data";
/**
 * Defines the names used for color recipes through the app
 */
export type ColorRecipeType = "backgroundFill" | "textFill" | "strokeFill";

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

export async function getRecipeValue(
    type: ColorRecipeType,
    name: string,
    designSystem: DesignSystem
): Promise<string> {
    let recipes: {
        [key: string]: DesignSystemResolver<string | SwatchFamily>;
    } | null = null;

    switch (type) {
        case "backgroundFill":
            recipes = fillRecipes;
            break;
        case "textFill":
            recipes = textFillRecipes;
            break;
        case "strokeFill":
            recipes = strokeRecipes;
            break;
    }

    if (recipes !== null && typeof recipes[name] === "function") {
        const value: string | SwatchFamily = recipes[name](designSystem);

        // TODO: https://github.com/microsoft/fast-dna/issues/2588
        return typeof value === "string" ? value : value.rest;
    } else {
        throw new Error(`No ${type} recipe of name ${name} found.`);
    }
}

export async function getRecipeNames(type: ColorRecipeType): Promise<string[]> {
    switch (type) {
        case "backgroundFill":
            return fillRecipeNames;
        case "textFill":
            return textFillRecipeNames;
        case "strokeFill":
            return strokeRecipeNames;
    }
}

/**
 * Applies color to a node, where what it paints depends on the ColorRecipeType
 */
export function paintNode(
    node: FillRecipeNode,
    type: "backgroundFill",
    color: ColorRGBA64
): void;
export function paintNode(
    node: StrokeRecipeNode,
    type: "strokeFill",
    color: ColorRGBA64
): void;
export function paintNode(
    node: TextFillRecipeNode,
    type: "textFill",
    color: ColorRGBA64
): void;
export function paintNode(
    node: PluginDataNode,
    type: ColorRecipeType,
    color: ColorRGBA64
): void {
    const colorObject = color.toObject();
    const paint: SolidPaint = {
        type: "SOLID",
        visible: true,
        opacity: colorObject.a,
        blendMode: "NORMAL",
        color: {
            r: colorObject.r,
            g: colorObject.g,
            b: colorObject.b,
        },
    };
    switch (type) {
        case "backgroundFill":
        case "textFill":
            node.fills = [paint];
            break;
        case "strokeFill":
            node.strokes = [paint];
            break;
    }
}
