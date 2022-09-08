import { DesignTokenResolver } from "@microsoft/fast-foundation";
import { InteractiveColorRecipe, InteractiveSwatchSet } from "../color/recipe.js";
import { deltaSwatch, deltaSwatchSet } from "../color/recipes/index.js";
import { Swatch } from "../color/swatch.js";
import { luminanceSwatch } from "../color/utilities/luminance-swatch.js";
import { fillColor } from "./color.js";
import { create, createNonCss } from "./create.js";
import { neutralPalette } from "./palette.js";

/**
 * A recipe that evaluates to a fixed layer treatment.
 *
 * @public
 */
export interface LayerRecipe {
    /**
     * Evaluate a fixed layer treatment.
     *
     * {@link neutralFillLayerFixedRecipe}
     *
     * @param element - The element for which to evaluate the recipe
     * @param index - The index of the layer, `0` for 'base', plus or minus relative to 'base'
     */
    evaluate(resolve: DesignTokenResolver, index: number): Swatch;
}

/**
 * Baseline values for light and dark mode for {@link neutralFillLayerBaseLuminance}.
 *
 * @public
 */
export const StandardLuminance = Object.freeze({
    LightMode: 1,
    DarkMode: 0.23,
} as const);

/**
 * Types of baseline values for light and dark mode for {@link neutralFillLayerBaseLuminance}.
 *
 * @public
 */
export type StandardLuminance = typeof StandardLuminance[keyof typeof StandardLuminance];

/**
 * The luminance value for the 'base' layer, {@link neutralFillLayerBase}
 *
 * @remarks
 * 0...1, 0 = black, 1 = white
 *
 * @public
 */
export const neutralFillLayerBaseLuminance = createNonCss<number>(
    "neutral-fill-layer-base-luminance"
).withDefault(StandardLuminance.LightMode);

/**
 * The offset between layer {@link Swatch}es on the {@link Palette}
 *
 * @remarks
 * Should be a positive value so 'minus' recipes are darker and 'plus' recipes are lighter
 *
 * @public
 */
export const neutralFillLayerRestDelta = createNonCss<number>(
    "neutral-fill-layer-rest-delta"
).withDefault(3);

/**
 * The offset from layer rest to hover
 *
 * @public
 */
export const neutralFillLayerHoverDelta = createNonCss<number>(
    "neutral-fill-layer-hover-delta"
).withDefault(-1);

/**
 * The offset from layer rest to active
 *
 * @public
 */
export const neutralFillLayerActiveDelta = createNonCss<number>(
    "neutral-fill-layer-active-delta"
).withDefault(1);

/**
 * The offset from layer rest to focus
 *
 * @public
 */
export const neutralFillLayerFocusDelta = createNonCss<number>(
    "neutral-fill-layer-focus-delta"
).withDefault(0);

/**
 * The 'fixed' layers represent background fills commonly used to define app structure
 *
 * @remarks
 * Generally the primary section is {@link neutralFillLayerBase} and underlying sections like navigation
 * or header are logically *beneath* using {@link neutralFillLayerMinus1}, etc. Layers above the 'base' like
 * flyouts or dialogs should use {@link neutralFillLayerPlus1}, etc.
 *
 * @public
 */
export const neutralFillLayerFixedRecipe = createNonCss<LayerRecipe>(
    "neutral-fill-layer-fixed-recipe"
).withDefault({
    evaluate: (resolve: DesignTokenResolver, index: number): Swatch =>
        deltaSwatch(
            resolve(neutralPalette),
            luminanceSwatch(resolve(neutralFillLayerBaseLuminance)),
            resolve(neutralFillLayerRestDelta) * index
        ),
});

/**
 * Design token for the fill of the 'base' layer
 *
 * @public
 */
export const neutralFillLayerFixedBase = create<Swatch>(
    "neutral-fill-layer-fixed-base"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(neutralFillLayerFixedRecipe).evaluate(resolve, 0)
);

/**
 * Design token for the fill of the layer 1 level beneath 'base'
 *
 * @public
 */
export const neutralFillLayerFixedMinus1 = create<Swatch>(
    "neutral-fill-layer-fixed-minus-1"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(neutralFillLayerFixedRecipe).evaluate(resolve, -1)
);

/**
 * Design token for the fill of the layer 2 levels beneath 'base'
 *
 * @public
 */
export const neutralFillLayerFixedMinus2 = create<Swatch>(
    "neutral-fill-layer-fixed-minus-2"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(neutralFillLayerFixedRecipe).evaluate(resolve, -2)
);

/**
 * Design token for the fill of the layer 3 levels beneath 'base'
 *
 * @public
 */
export const neutralFillLayerFixedMinus3 = create<Swatch>(
    "neutral-fill-layer-fixed-minus-3"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(neutralFillLayerFixedRecipe).evaluate(resolve, -3)
);

/**
 * Design token for the fill of the layer 4 levels beneath 'base'
 *
 * @public
 */
export const neutralFillLayerFixedMinus4 = create<Swatch>(
    "neutral-fill-layer-fixed-minus-4"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(neutralFillLayerFixedRecipe).evaluate(resolve, -4)
);

/**
 * Design token for the fill of the layer 1 level above 'base'
 *
 * @public
 */
export const neutralFillLayerFixedPlus1 = create<Swatch>(
    "neutral-fill-layer-fixed-plus-1"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(neutralFillLayerFixedRecipe).evaluate(resolve, 1)
);

/**
 * Design token for the fill of the layer 2 levels above 'base'
 *
 * @public
 */
export const neutralFillLayerFixedPlus2 = create<Swatch>(
    "neutral-fill-layer-fixed-plus-2"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(neutralFillLayerFixedRecipe).evaluate(resolve, 2)
);

/**
 * Design token for the fill of the layer 3 levels above 'base'
 *
 * @public
 */
export const neutralFillLayerFixedPlus3 = create<Swatch>(
    "neutral-fill-layer-fixed-plus-3"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(neutralFillLayerFixedRecipe).evaluate(resolve, 3)
);

/**
 * Design token for the fill of the layer 4 levels above 'base'
 *
 * @public
 */
export const neutralFillLayerFixedPlus4 = create<Swatch>(
    "neutral-fill-layer-fixed-plus-4"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(neutralFillLayerFixedRecipe).evaluate(resolve, 4)
);

/**
 * The recipe for a layer relative to its context (not 'fixed')
 *
 * @remarks
 * Useful for a `Card` or other container that's interactive.
 *
 * @public
 */
export const neutralFillLayerInteractiveRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-fill-layer-interactive-recipe"
).withDefault({
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        deltaSwatchSet(
            resolve(neutralPalette),
            reference || resolve(fillColor),
            resolve(neutralFillLayerRestDelta),
            resolve(neutralFillLayerHoverDelta),
            resolve(neutralFillLayerActiveDelta),
            resolve(neutralFillLayerFocusDelta)
        ),
});

/**
 * Design token for the fill of an interactive layer at rest
 *
 * @public
 */
export const neutralFillLayerRest = create<Swatch>("neutral-fill-layer-rest").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillLayerInteractiveRecipe).evaluate(resolve).rest
);

/**
 * Design token for the fill of an interactive layer while hovered
 *
 * @public
 */
export const neutralFillLayerHover = create<Swatch>(
    "neutral-fill-layer-hover"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillLayerInteractiveRecipe).evaluate(resolve).hover
);

/**
 * Design token for the fill of an interactive layer while pressed
 *
 * @public
 */
export const neutralFillLayerActive = create<Swatch>(
    "neutral-fill-layer-active"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillLayerInteractiveRecipe).evaluate(resolve).active
);

/**
 * Design token for the fill of an interactive layer while focused
 *
 * @public
 */
export const neutralFillLayerFocus = create<Swatch>(
    "neutral-fill-layer-focus"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillLayerInteractiveRecipe).evaluate(resolve).focus
);
