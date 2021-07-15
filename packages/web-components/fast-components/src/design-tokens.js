import { DesignToken } from "@microsoft/fast-foundation";
import { Direction } from "@microsoft/fast-web-utilities";
import { PaletteRGB } from "./color/palette";
import { accentFill as accentFillAlgorithm } from "./color/recipes/accent-fill";
import { accentForeground as accentForegroundAlgorithm } from "./color/recipes/accent-foreground";
import { foregroundOnAccent as foregroundOnAccentAlgorithm } from "./color/recipes/foreground-on-accent";
import { neutralFill as neutralFillAlgorithm } from "./color/recipes/neutral-fill";
import { neutralFillInput as neutralFillInputAlgorithm } from "./color/recipes/neutral-fill-input";
import { neutralFillLayer as neutralFillLayerAlgorithm } from "./color/recipes/neutral-fill-layer";
import { neutralFillStealth as neutralFillStealthAlgorithm } from "./color/recipes/neutral-fill-stealth";
import { neutralFillContrast as neutralFillContrastAlgorithm } from "./color/recipes/neutral-fill-contrast";
import {
    focusStrokeInner as focusStrokeInnerAlgorithm,
    focusStrokeOuter as focusStrokeOuterAlgorithm,
} from "./color/recipes/focus-stroke";
import { neutralForeground as neutralForegroundAlgorithm } from "./color/recipes/neutral-foreground";
import { neutralForegroundHint as neutralForegroundHintAlgorithm } from "./color/recipes/neutral-foreground-hint";
import { neutralLayerCardContainer as neutralLayerCardContainerAlgorithm } from "./color/recipes/neutral-layer-card-container";
import { neutralLayerFloating as neutralLayerFloatingAlgorithm } from "./color/recipes/neutral-layer-floating";
import { neutralLayer1 as neutralLayer1Algorithm } from "./color/recipes/neutral-layer-1";
import { neutralLayer2 as neutralLayer2Algorithm } from "./color/recipes/neutral-layer-2";
import { neutralLayer3 as neutralLayer3Algorithm } from "./color/recipes/neutral-layer-3";
import { neutralLayer4 as neutralLayer4Algorithm } from "./color/recipes/neutral-layer-4";
import { neutralStroke as neutralStrokeAlgorithm } from "./color/recipes/neutral-stroke";
import { neutralStrokeDivider as neutralStrokeDividerAlgorithm } from "./color/recipes/neutral-stroke-divider";
import { StandardLuminance } from "./color/utilities/base-layer-luminance";
import { accentBase, middleGrey } from "./color/utilities/color-constants";
const { create } = DesignToken;
// General tokens
/** @public */
export const bodyFont = create("body-font").withDefault(
    'aktiv-grotesk, "Segoe UI", Arial, Helvetica, sans-serif'
);
/** @public */
export const baseHeightMultiplier = create("base-height-multiplier").withDefault(10);
/** @public */
export const baseHorizontalSpacingMultiplier = create(
    "base-horizontal-spacing-multiplier"
).withDefault(3);
/** @public */
export const baseLayerLuminance = create("base-layer-luminance").withDefault(
    StandardLuminance.DarkMode
);
/** @public */
export const controlCornerRadius = create("control-corner-radius").withDefault(4);
/** @public */
export const density = create("density").withDefault(0);
/** @public */
export const designUnit = create("design-unit").withDefault(4);
/** @public */
export const direction = create("direction").withDefault(Direction.ltr);
/** @public */
export const disabledOpacity = create("disabled-opacity").withDefault(0.3);
/** @public */
export const strokeWidth = create("stroke-width").withDefault(1);
/** @public */
export const focusStrokeWidth = create("focus-stroke-width").withDefault(2);
// Typography values
/** @public */
export const typeRampBaseFontSize = create("type-ramp-base-font-size").withDefault(
    "14px"
);
/** @public */
export const typeRampBaseLineHeight = create("type-ramp-base-line-height").withDefault(
    "20px"
);
/** @public */
export const typeRampMinus1FontSize = create("type-ramp-minus-1-font-size").withDefault(
    "12px"
);
/** @public */
export const typeRampMinus1LineHeight = create(
    "type-ramp-minus-1-line-height"
).withDefault("16px");
/** @public */
export const typeRampMinus2FontSize = create("type-ramp-minus-2-font-size").withDefault(
    "10px"
);
/** @public */
export const typeRampMinus2LineHeight = create(
    "type-ramp-minus-2-line-height"
).withDefault("16px");
/** @public */
export const typeRampPlus1FontSize = create("type-ramp-plus-1-font-size").withDefault(
    "16px"
);
/** @public */
export const typeRampPlus1LineHeight = create("type-ramp-plus-1-line-height").withDefault(
    "24px"
);
/** @public */
export const typeRampPlus2FontSize = create("type-ramp-plus-2-font-size").withDefault(
    "20px"
);
/** @public */
export const typeRampPlus2LineHeight = create("type-ramp-plus-2-line-height").withDefault(
    "28px"
);
/** @public */
export const typeRampPlus3FontSize = create("type-ramp-plus-3-font-size").withDefault(
    "28px"
);
/** @public */
export const typeRampPlus3LineHeight = create("type-ramp-plus-3-line-height").withDefault(
    "36px"
);
/** @public */
export const typeRampPlus4FontSize = create("type-ramp-plus-4-font-size").withDefault(
    "34px"
);
/** @public */
export const typeRampPlus4LineHeight = create("type-ramp-plus-4-line-height").withDefault(
    "44px"
);
/** @public */
export const typeRampPlus5FontSize = create("type-ramp-plus-5-font-size").withDefault(
    "46px"
);
/** @public */
export const typeRampPlus5LineHeight = create("type-ramp-plus-5-line-height").withDefault(
    "56px"
);
/** @public */
export const typeRampPlus6FontSize = create("type-ramp-plus-6-font-size").withDefault(
    "60px"
);
/** @public */
export const typeRampPlus6LineHeight = create("type-ramp-plus-6-line-height").withDefault(
    "72px"
);
// Color recipe values
/** @public */
export const accentFillRestDelta = create("accent-fill-rest-delta").withDefault(0);
/** @public */
export const accentFillHoverDelta = create("accent-fill-hover-delta").withDefault(4);
/** @public */
export const accentFillActiveDelta = create("accent-fill-active-delta").withDefault(-5);
/** @public */
export const accentFillFocusDelta = create("accent-fill-focus-delta").withDefault(0);
/** @public */
export const accentForegroundRestDelta = create(
    "accent-foreground-rest-delta"
).withDefault(0);
/** @public */
export const accentForegroundHoverDelta = create(
    "accent-foreground-hover-delta"
).withDefault(6);
/** @public */
export const accentForegroundActiveDelta = create(
    "accent-foreground-active-delta"
).withDefault(-4);
/** @public */
export const accentForegroundFocusDelta = create(
    "accent-foreground-focus-delta"
).withDefault(0);
/** @public */
export const neutralFillRestDelta = create("neutral-fill-rest-delta").withDefault(7);
/** @public */
export const neutralFillHoverDelta = create("neutral-fill-hover-delta").withDefault(10);
/** @public */
export const neutralFillActiveDelta = create("neutral-fill-active-delta").withDefault(5);
/** @public */
export const neutralFillFocusDelta = create("neutral-fill-focus-delta").withDefault(0);
/** @public */
export const neutralFillInputRestDelta = create(
    "neutral-fill-input-rest-delta"
).withDefault(0);
/** @public */
export const neutralFillInputHoverDelta = create(
    "neutral-fill-input-hover-delta"
).withDefault(0);
/** @public */
export const neutralFillInputActiveDelta = create(
    "neutral-fill-input-active-delta"
).withDefault(0);
/** @public */
export const neutralFillInputFocusDelta = create(
    "neutral-fill-input-focus-delta"
).withDefault(0);
/** @public */
export const neutralFillStealthRestDelta = create(
    "neutral-fill-stealth-rest-delta"
).withDefault(0);
/** @public */
export const neutralFillStealthHoverDelta = create(
    "neutral-fill-stealth-hover-delta"
).withDefault(5);
/** @public */
export const neutralFillStealthActiveDelta = create(
    "neutral-fill-stealth-active-delta"
).withDefault(3);
/** @public */
export const neutralFillStealthFocusDelta = create(
    "neutral-fill-stealth-focus-delta"
).withDefault(0);
/** @public */
export const neutralFillStrongRestDelta = create(
    "neutral-fill-strong-rest-delta"
).withDefault(0);
/** @public */
export const neutralFillStrongHoverDelta = create(
    "neutral-fill-strong-hover-delta"
).withDefault(8);
/** @public */
export const neutralFillStrongActiveDelta = create(
    "neutral-fill-strong-active-delta"
).withDefault(-5);
/** @public */
export const neutralFillStrongFocusDelta = create(
    "neutral-fill-strong-focus-delta"
).withDefault(0);
/** @public */
export const neutralFillLayerRestDelta = create(
    "neutral-fill-layer-rest-delta"
).withDefault(3);
/** @public */
export const neutralStrokeRestDelta = create("neutral-stroke-rest-delta").withDefault(25);
/** @public */
export const neutralStrokeHoverDelta = create("neutral-stroke-hover-delta").withDefault(
    40
);
/** @public */
export const neutralStrokeActiveDelta = create("neutral-stroke-active-delta").withDefault(
    16
);
/** @public */
export const neutralStrokeFocusDelta = create("neutral-stroke-focus-delta").withDefault(
    25
);
/** @public */
export const neutralStrokeDividerRestDelta = create(
    "neutral-stroke-divider-rest-delta"
).withDefault(8);
// Color recipes
/** @public */
export const neutralPalette = create({
    name: "neutral-palette",
    cssCustomPropertyName: null,
}).withDefault(PaletteRGB.create(middleGrey));
/** @public */
export const accentPalette = create({
    name: "accent-palette",
    cssCustomPropertyName: null,
}).withDefault(PaletteRGB.create(accentBase));
/** @public */
export const fillColor = create("fill-color").withDefault(element => {
    const palette = neutralPalette.getValueFor(element);
    return palette.get(palette.swatches.length - 5);
});
var ContrastTarget;
(function (ContrastTarget) {
    ContrastTarget[(ContrastTarget["normal"] = 4.5)] = "normal";
    ContrastTarget[(ContrastTarget["large"] = 7)] = "large";
})(ContrastTarget || (ContrastTarget = {}));
// Accent Fill
/** @public */
export const accentFillRecipe = create({
    name: "accent-fill-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) =>
        accentFillAlgorithm(
            accentPalette.getValueFor(element),
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            accentFillHoverDelta.getValueFor(element),
            accentFillActiveDelta.getValueFor(element),
            accentFillFocusDelta.getValueFor(element),
            neutralFillRestDelta.getValueFor(element),
            neutralFillHoverDelta.getValueFor(element),
            neutralFillActiveDelta.getValueFor(element)
        ),
});
/** @public */
export const accentFillRest = create("accent-fill-rest").withDefault(element => {
    return accentFillRecipe.getValueFor(element).evaluate(element).rest;
});
/** @public */
export const accentFillHover = create("accent-fill-hover").withDefault(element => {
    return accentFillRecipe.getValueFor(element).evaluate(element).hover;
});
/** @public */
export const accentFillActive = create("accent-fill-active").withDefault(element => {
    return accentFillRecipe.getValueFor(element).evaluate(element).active;
});
/** @public */
export const accentFillFocus = create("accent-fill-focus").withDefault(element => {
    return accentFillRecipe.getValueFor(element).evaluate(element).focus;
});
// Foreground On Accent
const foregroundOnAccentByContrast = contrast => (element, reference) => {
    return foregroundOnAccentAlgorithm(
        reference || accentFillRest.getValueFor(element),
        contrast
    );
};
/** @public */
export const foregroundOnAccentRecipe = create({
    name: "foreground-on-accent-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) =>
        foregroundOnAccentByContrast(ContrastTarget.normal)(element, reference),
});
/** @public */
export const foregroundOnAccentRest = create(
    "foreground-on-accent-rest"
).withDefault(element =>
    foregroundOnAccentRecipe
        .getValueFor(element)
        .evaluate(element, accentFillRest.getValueFor(element))
);
/** @public */
export const foregroundOnAccentHover = create(
    "foreground-on-accent-hover"
).withDefault(element =>
    foregroundOnAccentRecipe
        .getValueFor(element)
        .evaluate(element, accentFillHover.getValueFor(element))
);
/** @public */
export const foregroundOnAccentActive = create(
    "foreground-on-accent-active"
).withDefault(element =>
    foregroundOnAccentRecipe
        .getValueFor(element)
        .evaluate(element, accentFillActive.getValueFor(element))
);
/** @public */
export const foregroundOnAccentFocus = create(
    "foreground-on-accent-focus"
).withDefault(element =>
    foregroundOnAccentRecipe
        .getValueFor(element)
        .evaluate(element, accentFillFocus.getValueFor(element))
);
/** @public */
export const foregroundOnAccentLargeRecipe = create({
    name: "foreground-on-accent-large-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) =>
        foregroundOnAccentByContrast(ContrastTarget.large)(element, reference),
});
/** @public */
export const foregroundOnAccentRestLarge = create(
    "foreground-on-accent-rest-large"
).withDefault(element =>
    foregroundOnAccentLargeRecipe
        .getValueFor(element)
        .evaluate(element, accentFillRest.getValueFor(element))
);
/** @public */
export const foregroundOnAccentHoverLarge = create(
    "foreground-on-accent-hover-large"
).withDefault(element =>
    foregroundOnAccentLargeRecipe
        .getValueFor(element)
        .evaluate(element, accentFillHover.getValueFor(element))
);
/** @public */
export const foregroundOnAccentActiveLarge = create(
    "foreground-on-accent-active-large"
).withDefault(element =>
    foregroundOnAccentLargeRecipe
        .getValueFor(element)
        .evaluate(element, accentFillActive.getValueFor(element))
);
/** @public */
export const foregroundOnAccentFocusLarge = create(
    "foreground-on-accent-focus-large"
).withDefault(element =>
    foregroundOnAccentLargeRecipe
        .getValueFor(element)
        .evaluate(element, accentFillFocus.getValueFor(element))
);
// Accent Foreground
const accentForegroundByContrast = contrast => (element, reference) =>
    accentForegroundAlgorithm(
        accentPalette.getValueFor(element),
        reference || fillColor.getValueFor(element),
        contrast,
        accentForegroundRestDelta.getValueFor(element),
        accentForegroundHoverDelta.getValueFor(element),
        accentForegroundActiveDelta.getValueFor(element),
        accentForegroundFocusDelta.getValueFor(element)
    );
/** @public */
export const accentForegroundRecipe = create({
    name: "accent-foreground-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) =>
        accentForegroundByContrast(ContrastTarget.normal)(element, reference),
});
/** @public */
export const accentForegroundRest = create("accent-foreground-rest").withDefault(
    element => accentForegroundRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const accentForegroundHover = create("accent-foreground-hover").withDefault(
    element => accentForegroundRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const accentForegroundActive = create("accent-foreground-active").withDefault(
    element => accentForegroundRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const accentForegroundFocus = create("accent-foreground-focus").withDefault(
    element => accentForegroundRecipe.getValueFor(element).evaluate(element).focus
);
// Neutral Fill
/** @public */
export const neutralFillRecipe = create({
    name: "neutral-fill-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) =>
        neutralFillAlgorithm(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralFillRestDelta.getValueFor(element),
            neutralFillHoverDelta.getValueFor(element),
            neutralFillActiveDelta.getValueFor(element),
            neutralFillFocusDelta.getValueFor(element)
        ),
});
/** @public */
export const neutralFillRest = create("neutral-fill-rest").withDefault(
    element => neutralFillRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const neutralFillHover = create("neutral-fill-hover").withDefault(
    element => neutralFillRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const neutralFillActive = create("neutral-fill-active").withDefault(
    element => neutralFillRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const neutralFillFocus = create("neutral-fill-focus").withDefault(
    element => neutralFillRecipe.getValueFor(element).evaluate(element).focus
);
// Neutral Fill Input
/** @public */
export const neutralFillInputRecipe = create({
    name: "neutral-fill-input-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) =>
        neutralFillInputAlgorithm(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralFillInputRestDelta.getValueFor(element),
            neutralFillInputHoverDelta.getValueFor(element),
            neutralFillInputActiveDelta.getValueFor(element),
            neutralFillInputFocusDelta.getValueFor(element)
        ),
});
/** @public */
export const neutralFillInputRest = create("neutral-fill-input-rest").withDefault(
    element => neutralFillInputRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const neutralFillInputHover = create("neutral-fill-input-hover").withDefault(
    element => neutralFillInputRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const neutralFillInputActive = create("neutral-fill-input-active").withDefault(
    element => neutralFillInputRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const neutralFillInputFocus = create("neutral-fill-input-focus").withDefault(
    element => neutralFillInputRecipe.getValueFor(element).evaluate(element).focus
);
// Neutral Fill Stealth
/** @public */
export const neutralFillStealthRecipe = create({
    name: "neutral-fill-stealth-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) =>
        neutralFillStealthAlgorithm(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralFillStealthRestDelta.getValueFor(element),
            neutralFillStealthHoverDelta.getValueFor(element),
            neutralFillStealthActiveDelta.getValueFor(element),
            neutralFillStealthFocusDelta.getValueFor(element),
            neutralFillRestDelta.getValueFor(element),
            neutralFillHoverDelta.getValueFor(element),
            neutralFillActiveDelta.getValueFor(element),
            neutralFillFocusDelta.getValueFor(element)
        ),
});
/** @public */
export const neutralFillStealthRest = create("neutral-fill-stealth-rest").withDefault(
    element => neutralFillStealthRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const neutralFillStealthHover = create("neutral-fill-stealth-hover").withDefault(
    element => neutralFillStealthRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const neutralFillStealthActive = create("neutral-fill-stealth-active").withDefault(
    element => neutralFillStealthRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const neutralFillStealthFocus = create("neutral-fill-stealth-focus").withDefault(
    element => neutralFillStealthRecipe.getValueFor(element).evaluate(element).focus
);
// Neutral Fill Strong
/** @public */
export const neutralFillStrongRecipe = create({
    name: "neutral-fill-strong-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) =>
        neutralFillContrastAlgorithm(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralFillStrongRestDelta.getValueFor(element),
            neutralFillStrongHoverDelta.getValueFor(element),
            neutralFillStrongActiveDelta.getValueFor(element),
            neutralFillStrongFocusDelta.getValueFor(element)
        ),
});
/** @public */
export const neutralFillStrongRest = create("neutral-fill-strong-rest").withDefault(
    element => neutralFillStrongRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const neutralFillStrongHover = create("neutral-fill-strong-hover").withDefault(
    element => neutralFillStrongRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const neutralFillStrongActive = create("neutral-fill-strong-active").withDefault(
    element => neutralFillStrongRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const neutralFillStrongFocus = create("neutral-fill-strong-focus").withDefault(
    element => neutralFillStrongRecipe.getValueFor(element).evaluate(element).focus
);
// Neutral Fill Layer
/** @public */
export const neutralFillLayerRecipe = create({
    name: "neutral-fill-layer-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) =>
        neutralFillLayerAlgorithm(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralFillLayerRestDelta.getValueFor(element)
        ),
});
/** @public */
export const neutralFillLayerRest = create(
    "neutral-fill-layer-rest"
).withDefault(element => neutralFillLayerRecipe.getValueFor(element).evaluate(element));
// Focus Stroke Outer
/** @public */
export const focusStrokeOuterRecipe = create({
    name: "focus-stroke-outer-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: element =>
        focusStrokeOuterAlgorithm(
            neutralPalette.getValueFor(element),
            fillColor.getValueFor(element)
        ),
});
/** @public */
export const focusStrokeOuter = create("focus-stroke-outer").withDefault(element =>
    focusStrokeOuterRecipe.getValueFor(element).evaluate(element)
);
// Focus Stroke Inner
/** @public */
export const focusStrokeInnerRecipe = create({
    name: "focus-stroke-inner-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: element =>
        focusStrokeInnerAlgorithm(
            accentPalette.getValueFor(element),
            fillColor.getValueFor(element),
            focusStrokeOuter.getValueFor(element)
        ),
});
/** @public */
export const focusStrokeInner = create("focus-stroke-inner").withDefault(element =>
    focusStrokeInnerRecipe.getValueFor(element).evaluate(element)
);
// Neutral Foreground Hint
/** @public */
export const neutralForegroundHintRecipe = create({
    name: "neutral-foreground-hint-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: element =>
        neutralForegroundHintAlgorithm(
            neutralPalette.getValueFor(element),
            fillColor.getValueFor(element)
        ),
});
/** @public */
export const neutralForegroundHint = create(
    "neutral-foreground-hint"
).withDefault(element =>
    neutralForegroundHintRecipe.getValueFor(element).evaluate(element)
);
// Neutral Foreground
/** @public */
export const neutralForegroundRecipe = create({
    name: "neutral-foreground-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: element =>
        neutralForegroundAlgorithm(
            neutralPalette.getValueFor(element),
            fillColor.getValueFor(element)
        ),
});
/** @public */
export const neutralForegroundRest = create(
    "neutral-foreground-rest"
).withDefault(element => neutralForegroundRecipe.getValueFor(element).evaluate(element));
// Neutral Stroke
/** @public */
export const neutralStrokeRecipe = create({
    name: "neutral-stroke-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: element => {
        return neutralStrokeAlgorithm(
            neutralPalette.getValueFor(element),
            fillColor.getValueFor(element),
            neutralStrokeRestDelta.getValueFor(element),
            neutralStrokeHoverDelta.getValueFor(element),
            neutralStrokeActiveDelta.getValueFor(element),
            neutralStrokeFocusDelta.getValueFor(element)
        );
    },
});
/** @public */
export const neutralStrokeRest = create("neutral-stroke-rest").withDefault(
    element => neutralStrokeRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const neutralStrokeHover = create("neutral-stroke-hover").withDefault(
    element => neutralStrokeRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const neutralStrokeActive = create("neutral-stroke-active").withDefault(
    element => neutralStrokeRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const neutralStrokeFocus = create("neutral-stroke-focus").withDefault(
    element => neutralStrokeRecipe.getValueFor(element).evaluate(element).focus
);
// Neutral Stroke Divider
/** @public */
export const neutralStrokeDividerRecipe = create({
    name: "neutral-stroke-divider-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: (element, reference) =>
        neutralStrokeDividerAlgorithm(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralStrokeDividerRestDelta.getValueFor(element)
        ),
});
/** @public */
export const neutralStrokeDividerRest = create(
    "neutral-stroke-divider-rest"
).withDefault(element =>
    neutralStrokeDividerRecipe.getValueFor(element).evaluate(element)
);
// Neutral Layer Card Container
/** @public */
export const neutralLayerCardContainerRecipe = create({
    name: "neutral-layer-card-container-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: element =>
        neutralLayerCardContainerAlgorithm(
            neutralPalette.getValueFor(element),
            baseLayerLuminance.getValueFor(element),
            neutralFillLayerRestDelta.getValueFor(element)
        ),
});
/** @public */
export const neutralLayerCardContainer = create(
    "neutral-layer-card-container"
).withDefault(element =>
    neutralLayerCardContainerRecipe.getValueFor(element).evaluate(element)
);
// Neutral Layer Floating
/** @public */
export const neutralLayerFloatingRecipe = create({
    name: "neutral-layer-floating-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: element =>
        neutralLayerFloatingAlgorithm(
            neutralPalette.getValueFor(element),
            baseLayerLuminance.getValueFor(element),
            neutralFillLayerRestDelta.getValueFor(element)
        ),
});
/** @public */
export const neutralLayerFloating = create(
    "neutral-layer-floating"
).withDefault(element =>
    neutralLayerFloatingRecipe.getValueFor(element).evaluate(element)
);
// Neutral Layer 1
/** @public */
export const neutralLayer1Recipe = create({
    name: "neutral-layer-1-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: element =>
        neutralLayer1Algorithm(
            neutralPalette.getValueFor(element),
            baseLayerLuminance.getValueFor(element)
        ),
});
/** @public */
export const neutralLayer1 = create("neutral-layer-1").withDefault(element =>
    neutralLayer1Recipe.getValueFor(element).evaluate(element)
);
// Neutral Layer 2
/** @public */
export const neutralLayer2Recipe = create({
    name: "neutral-layer-2-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: element =>
        neutralLayer2Algorithm(
            neutralPalette.getValueFor(element),
            baseLayerLuminance.getValueFor(element),
            neutralFillLayerRestDelta.getValueFor(element),
            neutralFillRestDelta.getValueFor(element),
            neutralFillHoverDelta.getValueFor(element),
            neutralFillActiveDelta.getValueFor(element)
        ),
});
/** @public */
export const neutralLayer2 = create("neutral-layer-2").withDefault(element =>
    neutralLayer2Recipe.getValueFor(element).evaluate(element)
);
// Neutral Layer 3
/** @public */
export const neutralLayer3Recipe = create({
    name: "neutral-layer-3-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: element =>
        neutralLayer3Algorithm(
            neutralPalette.getValueFor(element),
            baseLayerLuminance.getValueFor(element),
            neutralFillLayerRestDelta.getValueFor(element),
            neutralFillRestDelta.getValueFor(element),
            neutralFillHoverDelta.getValueFor(element),
            neutralFillActiveDelta.getValueFor(element)
        ),
});
/** @public */
export const neutralLayer3 = create("neutral-layer-3").withDefault(element =>
    neutralLayer3Recipe.getValueFor(element).evaluate(element)
);
// Neutral Layer 4
/** @public */
export const neutralLayer4Recipe = create({
    name: "neutral-layer-4-recipe",
    cssCustomPropertyName: null,
}).withDefault({
    evaluate: element =>
        neutralLayer4Algorithm(
            neutralPalette.getValueFor(element),
            baseLayerLuminance.getValueFor(element),
            neutralFillLayerRestDelta.getValueFor(element),
            neutralFillRestDelta.getValueFor(element),
            neutralFillHoverDelta.getValueFor(element),
            neutralFillActiveDelta.getValueFor(element)
        ),
});
/** @public */
export const neutralLayer4 = create("neutral-layer-4").withDefault(element =>
    neutralLayer4Recipe.getValueFor(element).evaluate(element)
);
