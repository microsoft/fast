import { DesignTokenResolver } from "@microsoft/fast-foundation";
import { Palette } from "../color/palette.js";
import { InteractiveColorRecipe, InteractiveSwatchSet } from "../color/recipe.js";
import { deltaSwatch, deltaSwatchSet } from "../color/recipes/index.js";
import { Swatch } from "../color/swatch.js";
import { luminanceSwatch } from "../color/utilities/luminance-swatch.js";
import { fillColor } from "./color.js";
import { create, createNonCss } from "./create.js";
import { neutralPalette } from "./palette.js";

/**
 * A recipe that evaluates to a "Fixed" layer treatment.
 *
 * @public
 */
export interface LayerRecipe {
    /**
     * Evaluate a "Fixed" layer treatment.
     *
     * {@link layerFillFixedRecipe}
     *
     * @param resolve - The resolver to evaluate the recipe
     * @param index - The index of the layer, `0` for "Base", plus or minus relative to "Base"
     */
    evaluate(resolve: DesignTokenResolver, index: number): Swatch;
}

/**
 * Baseline values for light and dark mode for {@link layerFillBaseLuminance}.
 *
 * @remarks
 * These values represent reasonable starting points for light and dark modes, but custom values can be used instead.
 *
 * @public
 */
export const LayerBaseLuminance = Object.freeze({
    LightMode: 0.95,
    DarkMode: 0.13,
} as const);

/**
 * The {@link Palette} to use for Layer recipes.
 *
 * @remarks
 * By default this maps to the {@link neutralPalette}.
 * Use a custom palette like `layerPalette.withDefault(PaletteRGB.from("#[HEX_COLOR]"))`.
 *
 * @public
 */
export const layerPalette =
    createNonCss<Palette>("layer-palette").withDefault(neutralPalette);

/**
 * The ideal luminance value for the "Base" layer, {@link layerFillFixedBase}.
 *
 * @remarks
 * 0...1, 0 = black, 1 = white.
 *
 * @public
 */
export const layerFillBaseLuminance = createNonCss<number>(
    "layer-fill-base-luminance"
).withDefault(LayerBaseLuminance.LightMode);

/**
 * The offset between "Fixed" layers, or from the container for "Interactive" rest state.
 *
 * @remarks
 * Should be a positive value so "Minus" recipes are darker and "Plus" recipes are lighter.
 *
 * @public
 */
export const layerFillDelta = createNonCss<number>("layer-fill-delta").withDefault(-3);

/**
 * The offset from the container for hover state.
 *
 * @public
 */
export const layerFillHoverDelta = createNonCss<number>(
    "layer-fill-hover-delta"
).withDefault(-4);

/**
 * The offset from the container for active state.
 *
 * @public
 */
export const layerFillActiveDelta = createNonCss<number>(
    "layer-fill-active-delta"
).withDefault(-2);

/**
 * The offset from the container for focus state.
 *
 * @public
 */
export const layerFillFocusDelta = createNonCss<number>(
    "layer-fill-focus-delta"
).withDefault(-3);

/**
 * The "Fixed" layers represent background fills commonly used to define app structure.
 *
 * @remarks
 * Generally the primary section is {@link layerFillFixedBase} and underlying sections like navigation
 * or header are logically *beneath* using {@link layerFillFixedMinus1}, etc. Layers above the "Base" like
 * flyouts or dialogs should use {@link layerFillFixedPlus1}, etc.
 *
 * @public
 */
export const layerFillFixedRecipe = createNonCss<LayerRecipe>(
    "layer-fill-fixed-recipe"
).withDefault({
    evaluate: (resolve: DesignTokenResolver, index: number): Swatch =>
        deltaSwatch(
            resolve(layerPalette),
            luminanceSwatch(resolve(layerFillBaseLuminance)),
            resolve(layerFillDelta) * index
        ),
});

/**
 * Design token for the fill of the "Base" layer.
 *
 * @public
 */
export const layerFillFixedBase = create<Swatch>("layer-fill-fixed-base").withDefault(
    (resolve: DesignTokenResolver) => resolve(layerFillFixedRecipe).evaluate(resolve, 0)
);

/**
 * Design token for the fill of the layer 1 level beneath "Base".
 *
 * @public
 */
export const layerFillFixedMinus1 = create<Swatch>(
    "layer-fill-fixed-minus-1"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(layerFillFixedRecipe).evaluate(resolve, -1)
);

/**
 * Design token for the fill of the layer 2 levels beneath "Base".
 *
 * @public
 */
export const layerFillFixedMinus2 = create<Swatch>(
    "layer-fill-fixed-minus-2"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(layerFillFixedRecipe).evaluate(resolve, -2)
);

/**
 * Design token for the fill of the layer 3 levels beneath "Base".
 *
 * @public
 */
export const layerFillFixedMinus3 = create<Swatch>(
    "layer-fill-fixed-minus-3"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(layerFillFixedRecipe).evaluate(resolve, -3)
);

/**
 * Design token for the fill of the layer 4 levels beneath "Base".
 *
 * @public
 */
export const layerFillFixedMinus4 = create<Swatch>(
    "layer-fill-fixed-minus-4"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(layerFillFixedRecipe).evaluate(resolve, -4)
);

/**
 * Design token for the fill of the layer 1 level above "Base".
 *
 * @public
 */
export const layerFillFixedPlus1 = create<Swatch>("layer-fill-fixed-plus-1").withDefault(
    (resolve: DesignTokenResolver) => resolve(layerFillFixedRecipe).evaluate(resolve, 1)
);

/**
 * Design token for the fill of the layer 2 levels above "Base".
 *
 * @public
 */
export const layerFillFixedPlus2 = create<Swatch>("layer-fill-fixed-plus-2").withDefault(
    (resolve: DesignTokenResolver) => resolve(layerFillFixedRecipe).evaluate(resolve, 2)
);

/**
 * Design token for the fill of the layer 3 levels above "Base".
 *
 * @public
 */
export const layerFillFixedPlus3 = create<Swatch>("layer-fill-fixed-plus-3").withDefault(
    (resolve: DesignTokenResolver) => resolve(layerFillFixedRecipe).evaluate(resolve, 3)
);

/**
 * Design token for the fill of the layer 4 levels above "Base".
 *
 * @public
 */
export const layerFillFixedPlus4 = create<Swatch>("layer-fill-fixed-plus-4").withDefault(
    (resolve: DesignTokenResolver) => resolve(layerFillFixedRecipe).evaluate(resolve, 4)
);

/**
 * The recipe for a layer relative to its context (as opposed to base luminance).
 *
 * @remarks
 * Useful for a `Card` or other container that's interactive.
 *
 * @public
 */
export const layerFillInteractiveRecipe = createNonCss<InteractiveColorRecipe>(
    "layer-fill-interactive-recipe"
).withDefault({
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        deltaSwatchSet(
            resolve(layerPalette),
            reference || resolve(fillColor),
            resolve(layerFillDelta),
            resolve(layerFillHoverDelta),
            resolve(layerFillActiveDelta),
            resolve(layerFillFocusDelta)
        ),
});

/**
 * Design token for the fill of an interactive layer at rest.
 *
 * @public
 */
export const layerFillInteractiveRest = create<Swatch>(
    "layer-fill-interactive-rest"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillInteractiveRecipe).evaluate(resolve).rest
);

/**
 * Design token for the fill of an interactive layer while hovered.
 *
 * @public
 */
export const layerFillInteractiveHover = create<Swatch>(
    "layer-fill-interactive-hover"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillInteractiveRecipe).evaluate(resolve).hover
);

/**
 * Design token for the fill of an interactive layer while pressed.
 *
 * @public
 */
export const layerFillInteractiveActive = create<Swatch>(
    "layer-fill-interactive-active"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillInteractiveRecipe).evaluate(resolve).active
);

/**
 * Design token for the fill of an interactive layer while focused.
 *
 * @public
 */
export const layerFillInteractiveFocus = create<Swatch>(
    "layer-fill-interactive-focus"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillInteractiveRecipe).evaluate(resolve).focus
);
