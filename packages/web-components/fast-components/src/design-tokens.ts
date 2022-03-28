import { DesignToken } from "@microsoft/fast-foundation";
import { Direction } from "@microsoft/fast-web-utilities";
import { Palette, PaletteRGB } from "./color/palette.js";
import { InteractiveSwatchSet } from "./color/recipe.js";
import { Swatch, SwatchRGB } from "./color/swatch.js";
import { contrastAndDeltaSwatchSet } from "./color/recipes/contrast-and-delta-swatch-set.js";
import { contrastSwatch } from "./color/recipes/contrast-swatch.js";
import { contrastSwatchSet } from "./color/recipes/contrast-swatch-set.js";
import { deltaSwatch } from "./color/recipes/delta-swatch.js";
import { deltaSwatchSet } from "./color/recipes/delta-swatch-set.js";
import {
    focusStrokeInner as focusStrokeInnerAlgorithm,
    focusStrokeOuter as focusStrokeOuterAlgorithm,
} from "./color/recipes/focus-stroke.js";
import { foregroundOnAccent as foregroundOnAccentAlgorithm } from "./color/recipes/foreground-on-accent.js";
import { neutralLayer1 as neutralLayer1Algorithm } from "./color/recipes/neutral-layer-1.js";
import { neutralLayer2 as neutralLayer2Algorithm } from "./color/recipes/neutral-layer-2.js";
import { neutralLayer3 as neutralLayer3Algorithm } from "./color/recipes/neutral-layer-3.js";
import { neutralLayer4 as neutralLayer4Algorithm } from "./color/recipes/neutral-layer-4.js";
import { neutralLayerFloating as neutralLayerFloatingAlgorithm } from "./color/recipes/neutral-layer-floating.js";
import { StandardLuminance } from "./color/utilities/base-layer-luminance.js";
import { accentBase, middleGrey } from "./color/utilities/color-constants.js";
import { idealColorDeltaSwatchSet } from "./color/recipes/ideal-color-delta-swatch-set.js";

/** @public @deprecated Use ColorRecipe instead */
export interface Recipe<T> {
    evaluate(element: HTMLElement, reference?: Swatch): T;
}

/** @public */
export interface ColorRecipe {
    evaluate(element: HTMLElement, reference?: Swatch): Swatch;
}

/** @public */
export interface InteractiveColorRecipe {
    evaluate(element: HTMLElement, reference?: Swatch): InteractiveSwatchSet;
}

const { create } = DesignToken;

function createNonCss<T>(name: string): DesignToken<T> {
    return DesignToken.create<T>({ name, cssCustomPropertyName: null });
}

// General tokens

/** @public */
export const direction = create<Direction>("direction").withDefault(Direction.ltr);
/** @public */
export const disabledOpacity = create<number>("disabled-opacity").withDefault(0.3);

// Density tokens

/** @public */
export const baseHeightMultiplier = create<number>("base-height-multiplier").withDefault(
    8
);
/** @public */
export const baseHorizontalSpacingMultiplier = create<number>(
    "base-horizontal-spacing-multiplier"
).withDefault(3);
/** @public */
export const density = create<number>("density").withDefault(0);
/** @public */
export const designUnit = create<number>("design-unit").withDefault(4);

// Appearance tokens

/** @public */
export const controlCornerRadius = create<number>("control-corner-radius").withDefault(6);
/** @public */
export const layerCornerRadius = create<number>("layer-corner-radius").withDefault(12);

/** @public */
export const strokeWidth = create<number>("stroke-width").withDefault(2);
/** @public */
export const focusStrokeWidth = create<number>("focus-stroke-width").withDefault(3);

// Typography values

/** @public */
export const bodyFont = create<string>("body-font").withDefault(
    'aktiv-grotesk, "Segoe UI", Arial, Helvetica, sans-serif'
);
/** @public */
export const typeRampBaseFontSize = create<string>(
    "type-ramp-base-font-size"
).withDefault("14px");
/** @public */
export const typeRampBaseLineHeight = create<string>(
    "type-ramp-base-line-height"
).withDefault("20px");
/** @public */
export const typeRampMinus1FontSize = create<string>(
    "type-ramp-minus-1-font-size"
).withDefault("12px");
/** @public */
export const typeRampMinus1LineHeight = create<string>(
    "type-ramp-minus-1-line-height"
).withDefault("16px");
/** @public */
export const typeRampMinus2FontSize = create<string>(
    "type-ramp-minus-2-font-size"
).withDefault("10px");
/** @public */
export const typeRampMinus2LineHeight = create<string>(
    "type-ramp-minus-2-line-height"
).withDefault("16px");
/** @public */
export const typeRampPlus1FontSize = create<string>(
    "type-ramp-plus-1-font-size"
).withDefault("16px");
/** @public */
export const typeRampPlus1LineHeight = create<string>(
    "type-ramp-plus-1-line-height"
).withDefault("24px");
/** @public */
export const typeRampPlus2FontSize = create<string>(
    "type-ramp-plus-2-font-size"
).withDefault("20px");
/** @public */
export const typeRampPlus2LineHeight = create<string>(
    "type-ramp-plus-2-line-height"
).withDefault("28px");
/** @public */
export const typeRampPlus3FontSize = create<string>(
    "type-ramp-plus-3-font-size"
).withDefault("28px");
/** @public */
export const typeRampPlus3LineHeight = create<string>(
    "type-ramp-plus-3-line-height"
).withDefault("36px");
/** @public */
export const typeRampPlus4FontSize = create<string>(
    "type-ramp-plus-4-font-size"
).withDefault("34px");
/** @public */
export const typeRampPlus4LineHeight = create<string>(
    "type-ramp-plus-4-line-height"
).withDefault("44px");
/** @public */
export const typeRampPlus5FontSize = create<string>(
    "type-ramp-plus-5-font-size"
).withDefault("46px");
/** @public */
export const typeRampPlus5LineHeight = create<string>(
    "type-ramp-plus-5-line-height"
).withDefault("56px");
/** @public */
export const typeRampPlus6FontSize = create<string>(
    "type-ramp-plus-6-font-size"
).withDefault("60px");
/** @public */
export const typeRampPlus6LineHeight = create<string>(
    "type-ramp-plus-6-line-height"
).withDefault("72px");

// Color recipe values

/** @public */
export const baseLayerLuminance = create<number>("base-layer-luminance").withDefault(
    StandardLuminance.DarkMode
);

/** @public */
export const accentFillRestDelta = createNonCss<number>(
    "accent-fill-rest-delta"
).withDefault(0);
/** @public */
export const accentFillHoverDelta = createNonCss<number>(
    "accent-fill-hover-delta"
).withDefault(4);
/** @public */
export const accentFillActiveDelta = createNonCss<number>(
    "accent-fill-active-delta"
).withDefault(-5);
/** @public */
export const accentFillFocusDelta = createNonCss<number>(
    "accent-fill-focus-delta"
).withDefault(0);

/** @public */
export const accentForegroundRestDelta = createNonCss<number>(
    "accent-foreground-rest-delta"
).withDefault(0);
/** @public */
export const accentForegroundHoverDelta = createNonCss<number>(
    "accent-foreground-hover-delta"
).withDefault(6);
/** @public */
export const accentForegroundActiveDelta = createNonCss<number>(
    "accent-foreground-active-delta"
).withDefault(-4);
/** @public */
export const accentForegroundFocusDelta = createNonCss<number>(
    "accent-foreground-focus-delta"
).withDefault(0);

/** @public */
export const neutralFillRestDelta = createNonCss<number>(
    "neutral-fill-rest-delta"
).withDefault(7);
/** @public */
export const neutralFillHoverDelta = createNonCss<number>(
    "neutral-fill-hover-delta"
).withDefault(10);
/** @public */
export const neutralFillActiveDelta = createNonCss<number>(
    "neutral-fill-active-delta"
).withDefault(4);
/** @public */
export const neutralFillFocusDelta = createNonCss<number>(
    "neutral-fill-focus-delta"
).withDefault(7);

/** @public */
export const neutralFillInputRestDelta = createNonCss<number>(
    "neutral-fill-input-rest-delta"
).withDefault(0);
/** @public */
export const neutralFillInputHoverDelta = createNonCss<number>(
    "neutral-fill-input-hover-delta"
).withDefault(0);
/** @public */
export const neutralFillInputActiveDelta = createNonCss<number>(
    "neutral-fill-input-active-delta"
).withDefault(-10);
/** @public */
export const neutralFillInputFocusDelta = createNonCss<number>(
    "neutral-fill-input-focus-delta"
).withDefault(0);

/** @public */
export const neutralFillStealthRestDelta = createNonCss<number>(
    "neutral-fill-stealth-rest-delta"
).withDefault(0);
/** @public */
export const neutralFillStealthHoverDelta = createNonCss<number>(
    "neutral-fill-stealth-hover-delta"
).withDefault(4);
/** @public */
export const neutralFillStealthActiveDelta = createNonCss<number>(
    "neutral-fill-stealth-active-delta"
).withDefault(2);
/** @public */
export const neutralFillStealthFocusDelta = createNonCss<number>(
    "neutral-fill-stealth-focus-delta"
).withDefault(0);

/** @public */
export const neutralFillStrongRestDelta = createNonCss<number>(
    "neutral-fill-strong-rest-delta"
).withDefault(0);
/** @public */
export const neutralFillStrongHoverDelta = createNonCss<number>(
    "neutral-fill-strong-hover-delta"
).withDefault(8);
/** @public */
export const neutralFillStrongActiveDelta = createNonCss<number>(
    "neutral-fill-strong-active-delta"
).withDefault(-5);
/** @public */
export const neutralFillStrongFocusDelta = createNonCss<number>(
    "neutral-fill-strong-focus-delta"
).withDefault(0);

/** @public */
export const neutralFillLayerRestDelta = createNonCss<number>(
    "neutral-fill-layer-rest-delta"
).withDefault(-2);
/** @public */
export const neutralFillLayerHoverDelta = createNonCss<number>(
    "neutral-fill-layer-hover-delta"
).withDefault(-2);
/** @public */
export const neutralFillLayerActiveDelta = createNonCss<number>(
    "neutral-fill-layer-active-delta"
).withDefault(-2);

/** @public */
export const neutralStrokeRestDelta = createNonCss<number>(
    "neutral-stroke-rest-delta"
).withDefault(45);
/** @public */
export const neutralStrokeHoverDelta = createNonCss<number>(
    "neutral-stroke-hover-delta"
).withDefault(50);
/** @public */
export const neutralStrokeActiveDelta = createNonCss<number>(
    "neutral-stroke-active-delta"
).withDefault(40);
/** @public */
export const neutralStrokeFocusDelta = createNonCss<number>(
    "neutral-stroke-focus-delta"
).withDefault(45);

/** @public */
export const neutralStrokeDividerRestDelta = createNonCss<number>(
    "neutral-stroke-divider-rest-delta"
).withDefault(8);

/** @public */
export const neutralStrokeInputFilledRestDelta = createNonCss<number>(
    "neutral-stroke-input-filled-rest-delta"
).withDefault(4);
/** @public */
export const neutralStrokeInputFilledHoverDelta = createNonCss<number>(
    "neutral-stroke-input-filled-hover-delta"
).withDefault(10);
/** @public */
export const neutralStrokeInputFilledActiveDelta = createNonCss<number>(
    "neutral-stroke-input-filled-active-delta"
).withDefault(10);
/** @public */
export const neutralStrokeInputFilledFocusDelta = createNonCss<number>(
    "neutral-stroke-input-filled-focus-delta"
).withDefault(4);

// Color recipes

/** @public */
export const neutralColor = create<Swatch>("neutral-color").withDefault(middleGrey);

/** @public */
export const neutralPalette = createNonCss<Palette>(
    "neutral-palette"
).withDefault((element: HTMLElement) =>
    PaletteRGB.from(neutralColor.getValueFor(element) as SwatchRGB)
);

/** @public */
export const accentColor = create<Swatch>("accent-color").withDefault(accentBase);

/** @public */
export const accentPalette = createNonCss<Palette>(
    "accent-palette"
).withDefault((element: HTMLElement) =>
    PaletteRGB.from(accentColor.getValueFor(element) as SwatchRGB)
);

// Neutral Layer Card Container
/** @public */
export const neutralLayerCardContainerRecipe = createNonCss<ColorRecipe>(
    "neutral-layer-card-container-recipe"
).withDefault({
    evaluate: (element: HTMLElement): Swatch =>
        neutralLayer2Algorithm(
            neutralPalette.getValueFor(element),
            baseLayerLuminance.getValueFor(element),
            neutralFillLayerRestDelta.getValueFor(element)
        ),
});

/** @public */
export const neutralLayerCardContainer = create<Swatch>(
    "neutral-layer-card-container"
).withDefault((element: HTMLElement) =>
    neutralLayerCardContainerRecipe.getValueFor(element).evaluate(element)
);

// Neutral Layer Floating
/** @public */
export const neutralLayerFloatingRecipe = createNonCss<ColorRecipe>(
    "neutral-layer-floating-recipe"
).withDefault({
    evaluate: (element: HTMLElement): Swatch =>
        neutralLayerFloatingAlgorithm(
            neutralPalette.getValueFor(element),
            baseLayerLuminance.getValueFor(element),
            neutralFillLayerRestDelta.getValueFor(element)
        ),
});

/** @public */
export const neutralLayerFloating = create<Swatch>(
    "neutral-layer-floating"
).withDefault((element: HTMLElement) =>
    neutralLayerFloatingRecipe.getValueFor(element).evaluate(element)
);

// Neutral Layer 1
/** @public */
export const neutralLayer1Recipe = createNonCss<ColorRecipe>(
    "neutral-layer-1-recipe"
).withDefault({
    evaluate: (element: HTMLElement): Swatch =>
        neutralLayer1Algorithm(
            neutralPalette.getValueFor(element),
            baseLayerLuminance.getValueFor(element)
        ),
});

/** @public */
export const neutralLayer1 = create<Swatch>(
    "neutral-layer-1"
).withDefault((element: HTMLElement) =>
    neutralLayer1Recipe.getValueFor(element).evaluate(element)
);

// Neutral Layer 2
/** @public */
export const neutralLayer2Recipe = createNonCss<ColorRecipe>(
    "neutral-layer-2-recipe"
).withDefault({
    evaluate: (element: HTMLElement): Swatch =>
        neutralLayer2Algorithm(
            neutralPalette.getValueFor(element),
            baseLayerLuminance.getValueFor(element),
            neutralFillLayerRestDelta.getValueFor(element)
        ),
});

/** @public */
export const neutralLayer2 = create<Swatch>(
    "neutral-layer-2"
).withDefault((element: HTMLElement) =>
    neutralLayer2Recipe.getValueFor(element).evaluate(element)
);

// Neutral Layer 3
/** @public */
export const neutralLayer3Recipe = createNonCss<ColorRecipe>(
    "neutral-layer-3-recipe"
).withDefault({
    evaluate: (element: HTMLElement): Swatch =>
        neutralLayer3Algorithm(
            neutralPalette.getValueFor(element),
            baseLayerLuminance.getValueFor(element),
            neutralFillLayerRestDelta.getValueFor(element)
        ),
});

/** @public */
export const neutralLayer3 = create<Swatch>(
    "neutral-layer-3"
).withDefault((element: HTMLElement) =>
    neutralLayer3Recipe.getValueFor(element).evaluate(element)
);

// Neutral Layer 4
/** @public */
export const neutralLayer4Recipe = createNonCss<ColorRecipe>(
    "neutral-layer-4-recipe"
).withDefault({
    evaluate: (element: HTMLElement): Swatch =>
        neutralLayer4Algorithm(
            neutralPalette.getValueFor(element),
            baseLayerLuminance.getValueFor(element),
            neutralFillLayerRestDelta.getValueFor(element)
        ),
});

/** @public */
export const neutralLayer4 = create<Swatch>(
    "neutral-layer-4"
).withDefault((element: HTMLElement) =>
    neutralLayer4Recipe.getValueFor(element).evaluate(element)
);

/** @public */
export const fillColor = create<Swatch>("fill-color").withDefault(element =>
    neutralLayer1.getValueFor(element)
);

enum ContrastTarget {
    normal = 4.5,
    large = 7,
}

// Accent Fill
/** @public */
export const accentFillRecipe = createNonCss<InteractiveColorRecipe>(
    "accent-fill-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        idealColorDeltaSwatchSet(
            accentPalette.getValueFor(element),
            accentPalette.getValueFor(element).source,
            reference || fillColor.getValueFor(element),
            ContrastTarget.normal,
            accentFillRestDelta.getValueFor(element),
            accentFillHoverDelta.getValueFor(element),
            accentFillActiveDelta.getValueFor(element),
            accentFillFocusDelta.getValueFor(element)
        ),
});

/** @public */
export const accentFillRest = create<Swatch>("accent-fill-rest").withDefault(
    (element: HTMLElement) => {
        return accentFillRecipe.getValueFor(element).evaluate(element).rest;
    }
);
/** @public */
export const accentFillHover = create<Swatch>("accent-fill-hover").withDefault(
    (element: HTMLElement) => {
        return accentFillRecipe.getValueFor(element).evaluate(element).hover;
    }
);
/** @public */
export const accentFillActive = create<Swatch>("accent-fill-active").withDefault(
    (element: HTMLElement) => {
        return accentFillRecipe.getValueFor(element).evaluate(element).active;
    }
);
/** @public */
export const accentFillFocus = create<Swatch>("accent-fill-focus").withDefault(
    (element: HTMLElement) => {
        return accentFillRecipe.getValueFor(element).evaluate(element).focus;
    }
);

// Foreground On Accent
const foregroundOnAccentByContrast = (contrast: number) => (
    element: HTMLElement,
    reference?: Swatch
) => {
    return foregroundOnAccentAlgorithm(
        reference || accentFillRest.getValueFor(element),
        contrast
    );
};

/** @public */
export const foregroundOnAccentRecipe = createNonCss<ColorRecipe>(
    "foreground-on-accent-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): Swatch =>
        foregroundOnAccentByContrast(ContrastTarget.normal)(element, reference),
});
/** @public */
export const foregroundOnAccentRest = create<Swatch>(
    "foreground-on-accent-rest"
).withDefault((element: HTMLElement) =>
    foregroundOnAccentRecipe
        .getValueFor(element)
        .evaluate(element, accentFillRest.getValueFor(element))
);
/** @public */
export const foregroundOnAccentHover = create<Swatch>(
    "foreground-on-accent-hover"
).withDefault((element: HTMLElement) =>
    foregroundOnAccentRecipe
        .getValueFor(element)
        .evaluate(element, accentFillHover.getValueFor(element))
);
/** @public */
export const foregroundOnAccentActive = create<Swatch>(
    "foreground-on-accent-active"
).withDefault((element: HTMLElement) =>
    foregroundOnAccentRecipe
        .getValueFor(element)
        .evaluate(element, accentFillActive.getValueFor(element))
);
/** @public */
export const foregroundOnAccentFocus = create<Swatch>(
    "foreground-on-accent-focus"
).withDefault((element: HTMLElement) =>
    foregroundOnAccentRecipe
        .getValueFor(element)
        .evaluate(element, accentFillFocus.getValueFor(element))
);

// Foreground On Accent Large
/** @public */
export const foregroundOnAccentLargeRecipe = createNonCss<ColorRecipe>(
    "foreground-on-accent-large-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): Swatch =>
        foregroundOnAccentByContrast(ContrastTarget.large)(element, reference),
});
/** @public */
export const foregroundOnAccentRestLarge = create<Swatch>(
    "foreground-on-accent-rest-large"
).withDefault((element: HTMLElement) =>
    foregroundOnAccentLargeRecipe
        .getValueFor(element)
        .evaluate(element, accentFillRest.getValueFor(element))
);
/** @public */
export const foregroundOnAccentHoverLarge = create<Swatch>(
    "foreground-on-accent-hover-large"
).withDefault((element: HTMLElement) =>
    foregroundOnAccentLargeRecipe
        .getValueFor(element)
        .evaluate(element, accentFillHover.getValueFor(element))
);
/** @public */
export const foregroundOnAccentActiveLarge = create<Swatch>(
    "foreground-on-accent-active-large"
).withDefault((element: HTMLElement) =>
    foregroundOnAccentLargeRecipe
        .getValueFor(element)
        .evaluate(element, accentFillActive.getValueFor(element))
);
/** @public */
export const foregroundOnAccentFocusLarge = create<Swatch>(
    "foreground-on-accent-focus-large"
).withDefault((element: HTMLElement) =>
    foregroundOnAccentLargeRecipe
        .getValueFor(element)
        .evaluate(element, accentFillFocus.getValueFor(element))
);

// Accent Foreground

/** @public */
export const accentForegroundRecipe = createNonCss<InteractiveColorRecipe>(
    "accent-foreground-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        idealColorDeltaSwatchSet(
            accentPalette.getValueFor(element),
            accentPalette.getValueFor(element).source,
            reference || fillColor.getValueFor(element),
            ContrastTarget.normal,
            accentForegroundRestDelta.getValueFor(element),
            accentForegroundHoverDelta.getValueFor(element),
            accentForegroundActiveDelta.getValueFor(element),
            accentForegroundFocusDelta.getValueFor(element)
        ),
});

/** @public */
export const accentForegroundRest = create<Swatch>("accent-foreground-rest").withDefault(
    (element: HTMLElement) =>
        accentForegroundRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const accentForegroundHover = create<Swatch>(
    "accent-foreground-hover"
).withDefault(
    (element: HTMLElement) =>
        accentForegroundRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const accentForegroundActive = create<Swatch>(
    "accent-foreground-active"
).withDefault(
    (element: HTMLElement) =>
        accentForegroundRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const accentForegroundFocus = create<Swatch>(
    "accent-foreground-focus"
).withDefault(
    (element: HTMLElement) =>
        accentForegroundRecipe.getValueFor(element).evaluate(element).focus
);

// Neutral Fill
/** @public */
export const neutralFillRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-fill-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        deltaSwatchSet(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralFillRestDelta.getValueFor(element),
            neutralFillHoverDelta.getValueFor(element),
            neutralFillActiveDelta.getValueFor(element),
            neutralFillFocusDelta.getValueFor(element)
        ),
});
/** @public */
export const neutralFillRest = create<Swatch>("neutral-fill-rest").withDefault(
    (element: HTMLElement) =>
        neutralFillRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const neutralFillHover = create<Swatch>("neutral-fill-hover").withDefault(
    (element: HTMLElement) =>
        neutralFillRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const neutralFillActive = create<Swatch>("neutral-fill-active").withDefault(
    (element: HTMLElement) =>
        neutralFillRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const neutralFillFocus = create<Swatch>("neutral-fill-focus").withDefault(
    (element: HTMLElement) =>
        neutralFillRecipe.getValueFor(element).evaluate(element).focus
);

// Neutral Fill Input
/** @public */
export const neutralFillInputRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-fill-input-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        deltaSwatchSet(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralFillInputRestDelta.getValueFor(element),
            neutralFillInputHoverDelta.getValueFor(element),
            neutralFillInputActiveDelta.getValueFor(element),
            neutralFillInputFocusDelta.getValueFor(element)
        ),
});

/** @public */
export const neutralFillInputRest = create<Swatch>("neutral-fill-input-rest").withDefault(
    (element: HTMLElement) =>
        neutralFillInputRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const neutralFillInputHover = create<Swatch>(
    "neutral-fill-input-hover"
).withDefault(
    (element: HTMLElement) =>
        neutralFillInputRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const neutralFillInputActive = create<Swatch>(
    "neutral-fill-input-active"
).withDefault(
    (element: HTMLElement) =>
        neutralFillInputRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const neutralFillInputFocus = create<Swatch>(
    "neutral-fill-input-focus"
).withDefault(
    (element: HTMLElement) =>
        neutralFillInputRecipe.getValueFor(element).evaluate(element).focus
);

// Neutral Fill Stealth
/** @public */
export const neutralFillStealthRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-fill-stealth-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        deltaSwatchSet(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralFillStealthRestDelta.getValueFor(element),
            neutralFillStealthHoverDelta.getValueFor(element),
            neutralFillStealthActiveDelta.getValueFor(element),
            neutralFillStealthFocusDelta.getValueFor(element)
        ),
});

/** @public */
export const neutralFillStealthRest = create<Swatch>(
    "neutral-fill-stealth-rest"
).withDefault(
    (element: HTMLElement) =>
        neutralFillStealthRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const neutralFillStealthHover = create<Swatch>(
    "neutral-fill-stealth-hover"
).withDefault(
    (element: HTMLElement) =>
        neutralFillStealthRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const neutralFillStealthActive = create<Swatch>(
    "neutral-fill-stealth-active"
).withDefault(
    (element: HTMLElement) =>
        neutralFillStealthRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const neutralFillStealthFocus = create<Swatch>(
    "neutral-fill-stealth-focus"
).withDefault(
    (element: HTMLElement) =>
        neutralFillStealthRecipe.getValueFor(element).evaluate(element).focus
);

// Neutral Fill Strong
/** @public */
export const neutralFillStrongRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-fill-strong-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            ContrastTarget.normal,
            neutralFillStrongRestDelta.getValueFor(element),
            neutralFillStrongHoverDelta.getValueFor(element),
            neutralFillStrongActiveDelta.getValueFor(element),
            neutralFillStrongFocusDelta.getValueFor(element)
        ),
});

/** @public */
export const neutralFillStrongRest = create<Swatch>(
    "neutral-fill-strong-rest"
).withDefault(
    (element: HTMLElement) =>
        neutralFillStrongRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const neutralFillStrongHover = create<Swatch>(
    "neutral-fill-strong-hover"
).withDefault(
    (element: HTMLElement) =>
        neutralFillStrongRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const neutralFillStrongActive = create<Swatch>(
    "neutral-fill-strong-active"
).withDefault(
    (element: HTMLElement) =>
        neutralFillStrongRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const neutralFillStrongFocus = create<Swatch>(
    "neutral-fill-strong-focus"
).withDefault(
    (element: HTMLElement) =>
        neutralFillStrongRecipe.getValueFor(element).evaluate(element).focus
);

// Neutral Fill Layer
/** @public */
export const neutralFillLayerRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-fill-layer-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        deltaSwatchSet(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralFillLayerRestDelta.getValueFor(element),
            neutralFillLayerHoverDelta.getValueFor(element),
            neutralFillLayerActiveDelta.getValueFor(element),
            neutralFillLayerRestDelta.getValueFor(element),
            1
        ),
});
/** @public */
export const neutralFillLayerRest = create<Swatch>("neutral-fill-layer-rest").withDefault(
    (element: HTMLElement) =>
        neutralFillLayerRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const neutralFillLayerHover = create<Swatch>(
    "neutral-fill-layer-hover"
).withDefault(
    (element: HTMLElement) =>
        neutralFillLayerRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const neutralFillLayerActive = create<Swatch>(
    "neutral-fill-layer-active"
).withDefault(
    (element: HTMLElement) =>
        neutralFillLayerRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const neutralFillLayerFocus = create<Swatch>(
    "neutral-fill-layer-focus"
).withDefault(
    (element: HTMLElement) =>
        neutralFillLayerRecipe.getValueFor(element).evaluate(element).focus
);

// Focus Stroke Outer
/** @public */
export const focusStrokeOuterRecipe = createNonCss<ColorRecipe>(
    "focus-stroke-outer-recipe"
).withDefault({
    evaluate: (element: HTMLElement): Swatch =>
        focusStrokeOuterAlgorithm(
            neutralPalette.getValueFor(element),
            fillColor.getValueFor(element)
        ),
});

/** @public */
export const focusStrokeOuter = create<Swatch>(
    "focus-stroke-outer"
).withDefault((element: HTMLElement) =>
    focusStrokeOuterRecipe.getValueFor(element).evaluate(element)
);

// Focus Stroke Inner
/** @public */
export const focusStrokeInnerRecipe = createNonCss<ColorRecipe>(
    "focus-stroke-inner-recipe"
).withDefault({
    evaluate: (element: HTMLElement): Swatch =>
        focusStrokeInnerAlgorithm(
            accentPalette.getValueFor(element),
            fillColor.getValueFor(element),
            focusStrokeOuter.getValueFor(element)
        ),
});

/** @public */
export const focusStrokeInner = create<Swatch>(
    "focus-stroke-inner"
).withDefault((element: HTMLElement) =>
    focusStrokeInnerRecipe.getValueFor(element).evaluate(element)
);

// Stroke Control Strong
/** @public */
export const strokeControlStrongRecipe = createNonCss<InteractiveColorRecipe>(
    "stroke-control-strong-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        contrastSwatchSet(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            10,
            0,
            42,
            24,
            42
        ),
});

/** @public */
export const strokeControlStrongRest = create<Swatch>(
    "stroke-control-strong-rest"
).withDefault(
    (element: HTMLElement) =>
        strokeControlStrongRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const strokeControlStrongHover = create<Swatch>(
    "stroke-control-strong-hover"
).withDefault(
    (element: HTMLElement) =>
        strokeControlStrongRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const strokeControlStrongActive = create<Swatch>(
    "stroke-control-strong-active"
).withDefault(
    (element: HTMLElement) =>
        strokeControlStrongRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const strokeControlStrongFocus = create<Swatch>(
    "stroke-control-strong-focus"
).withDefault(
    (element: HTMLElement) =>
        strokeControlStrongRecipe.getValueFor(element).evaluate(element).focus
);

// Neutral Foreground Hint
/** @public */
export const neutralForegroundHintRecipe = createNonCss<ColorRecipe>(
    "neutral-foreground-hint-recipe"
).withDefault({
    evaluate: (element: HTMLElement): Swatch =>
        contrastSwatch(
            neutralPalette.getValueFor(element),
            fillColor.getValueFor(element),
            ContrastTarget.normal
        ),
});

/** @public */
export const neutralForegroundHint = create<Swatch>(
    "neutral-foreground-hint"
).withDefault((element: HTMLElement) =>
    neutralForegroundHintRecipe.getValueFor(element).evaluate(element)
);

// Neutral Foreground
/** @public */
export const neutralForegroundRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-foreground-recipe"
).withDefault({
    evaluate: (element: HTMLElement): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            neutralPalette.getValueFor(element),
            fillColor.getValueFor(element),
            10,
            0,
            5,
            -5,
            0
        ),
});

/** @public */
export const neutralForegroundRest = create<Swatch>(
    "neutral-foreground-rest"
).withDefault(
    (element: HTMLElement) =>
        neutralForegroundRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const neutralForegroundHover = create<Swatch>(
    "neutral-foreground-hover"
).withDefault(
    (element: HTMLElement) =>
        neutralForegroundRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const neutralForegroundActive = create<Swatch>(
    "neutral-foreground-active"
).withDefault(
    (element: HTMLElement) =>
        neutralForegroundRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const neutralForegroundFocus = create<Swatch>(
    "neutral-foreground-focus"
).withDefault(
    (element: HTMLElement) =>
        neutralForegroundRecipe.getValueFor(element).evaluate(element).focus
);

// Neutral Stroke
/** @public */
export const neutralStrokeRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-stroke-recipe"
).withDefault({
    evaluate: (element: HTMLElement): InteractiveSwatchSet =>
        deltaSwatchSet(
            neutralPalette.getValueFor(element),
            fillColor.getValueFor(element),
            neutralStrokeRestDelta.getValueFor(element),
            neutralStrokeHoverDelta.getValueFor(element),
            neutralStrokeActiveDelta.getValueFor(element),
            neutralStrokeFocusDelta.getValueFor(element)
        ),
});

/** @public */
export const neutralStrokeRest = create<Swatch>("neutral-stroke-rest").withDefault(
    (element: HTMLElement) =>
        neutralStrokeRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const neutralStrokeHover = create<Swatch>("neutral-stroke-hover").withDefault(
    (element: HTMLElement) =>
        neutralStrokeRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const neutralStrokeActive = create<Swatch>("neutral-stroke-active").withDefault(
    (element: HTMLElement) =>
        neutralStrokeRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const neutralStrokeFocus = create<Swatch>("neutral-stroke-focus").withDefault(
    (element: HTMLElement) =>
        neutralStrokeRecipe.getValueFor(element).evaluate(element).focus
);

// Neutral Stroke Input Filled
/** @public */
export const neutralStrokeInputFilledRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-stroke-input-filled-recipe"
).withDefault({
    evaluate: (element: HTMLElement): InteractiveSwatchSet =>
        deltaSwatchSet(
            neutralPalette.getValueFor(element),
            fillColor.getValueFor(element),
            neutralStrokeInputFilledRestDelta.getValueFor(element),
            neutralStrokeInputFilledHoverDelta.getValueFor(element),
            neutralStrokeInputFilledActiveDelta.getValueFor(element),
            neutralStrokeInputFilledFocusDelta.getValueFor(element)
        ),
});

/** @public */
export const neutralStrokeInputFilledRest = create<Swatch>(
    "neutral-stroke-input-filled-rest"
).withDefault(
    (element: HTMLElement) =>
        neutralStrokeInputFilledRecipe.getValueFor(element).evaluate(element).rest
);
/** @public */
export const neutralStrokeInputFilledHover = create<Swatch>(
    "neutral-stroke-input-filled-hover"
).withDefault(
    (element: HTMLElement) =>
        neutralStrokeInputFilledRecipe.getValueFor(element).evaluate(element).hover
);
/** @public */
export const neutralStrokeInputFilledActive = create<Swatch>(
    "neutral-stroke-input-filled-active"
).withDefault(
    (element: HTMLElement) =>
        neutralStrokeInputFilledRecipe.getValueFor(element).evaluate(element).active
);
/** @public */
export const neutralStrokeInputFilledFocus = create<Swatch>(
    "neutral-stroke-input-filled-focus"
).withDefault(
    (element: HTMLElement) =>
        neutralStrokeInputFilledRecipe.getValueFor(element).evaluate(element).focus
);

// Neutral Stroke Divider
/** @public */
export const neutralStrokeDividerRecipe = createNonCss<ColorRecipe>(
    "neutral-stroke-divider-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): Swatch =>
        deltaSwatch(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralStrokeDividerRestDelta.getValueFor(element)
        ),
});
/** @public */
export const neutralStrokeDividerRest = create<Swatch>(
    "neutral-stroke-divider-rest"
).withDefault(element =>
    neutralStrokeDividerRecipe.getValueFor(element).evaluate(element)
);

/**
 * The control height formula expressed as a design token.
 * This token does not provide a CSS custom property.
 *
 * @public
 */
export const heightNumberAsToken = DesignToken.create<number>({
    name: "height-number",
    cssCustomPropertyName: null,
}).withDefault(
    target =>
        (baseHeightMultiplier.getValueFor(target) + density.getValueFor(target)) *
        designUnit.getValueFor(target)
);
