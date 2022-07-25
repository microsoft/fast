import { parseColorHexRGB } from "@microsoft/fast-colors";
import { blackOrWhiteByContrast } from "../color/index.js";
import {
    ColorRecipe,
    InteractiveColorRecipe,
    InteractiveSwatchSet,
} from "../color/recipe.js";
import { blackOrWhiteByContrastSet } from "../color/recipes/black-or-white-by-contrast-set.js";
import { contrastAndDeltaSwatchSet } from "../color/recipes/contrast-and-delta-swatch-set.js";
import { contrastSwatch } from "../color/recipes/contrast-swatch.js";
import { deltaSwatchSet } from "../color/recipes/delta-swatch-set.js";
import { deltaSwatch } from "../color/recipes/delta-swatch.js";
import { Swatch, SwatchRGB } from "../color/swatch.js";
import { create, createNonCss } from "./create.js";
import { accentPalette, neutralPalette } from "./palette.js";

/**
 * Convenience values for WCAG contrast requirements.
 *
 * @public
 */
export const ContrastTarget = Object.freeze({
    /**
     * Minimum contrast for normal (<= 14pt) text (AA rating).
     */
    NormalText: 4.5,

    /**
     * Minimum contrast for large (> 14pt) text (AA rating).
     */
    LargeText: 3,
} as const);

/** @public */
export const fillColor = create<Swatch>("fill-color").withDefault(
    SwatchRGB.from(parseColorHexRGB("#FFFFFF")!)
);

// Accent Fill

/** @public */
export const accentFillMinContrast = createNonCss<number>(
    "accent-fill-min-contrast"
).withDefault(5.5);

/** @public */
export const accentFillRestDelta = createNonCss<number>(
    "accent-fill-rest-delta"
).withDefault(0);

/** @public */
export const accentFillHoverDelta = createNonCss<number>(
    "accent-fill-hover-delta"
).withDefault(-2);

/** @public */
export const accentFillActiveDelta = createNonCss<number>(
    "accent-fill-active-delta"
).withDefault(-5);

/** @public */
export const accentFillFocusDelta = createNonCss<number>(
    "accent-fill-focus-delta"
).withDefault(0);

/** @public */
export const accentFillRecipe = createNonCss<InteractiveColorRecipe>(
    "accent-fill-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            accentPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            accentFillMinContrast.getValueFor(element),
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

/** @public */
export const foregroundOnAccentRecipe = createNonCss<InteractiveColorRecipe>(
    "foreground-on-accent-recipe"
).withDefault({
    evaluate: (element: HTMLElement): InteractiveSwatchSet =>
        blackOrWhiteByContrastSet(
            accentFillRest.getValueFor(element),
            accentFillHover.getValueFor(element),
            accentFillActive.getValueFor(element),
            accentFillFocus.getValueFor(element),
            ContrastTarget.NormalText,
            false
        ),
});

/** @public */
export const foregroundOnAccentRest = create<Swatch>(
    "foreground-on-accent-rest"
).withDefault(
    (element: HTMLElement) =>
        foregroundOnAccentRecipe.getValueFor(element).evaluate(element).rest
);

/** @public */
export const foregroundOnAccentHover = create<Swatch>(
    "foreground-on-accent-hover"
).withDefault(
    (element: HTMLElement) =>
        foregroundOnAccentRecipe.getValueFor(element).evaluate(element).hover
);

/** @public */
export const foregroundOnAccentActive = create<Swatch>(
    "foreground-on-accent-active"
).withDefault(
    (element: HTMLElement) =>
        foregroundOnAccentRecipe.getValueFor(element).evaluate(element).active
);

/** @public */
export const foregroundOnAccentFocus = create<Swatch>(
    "foreground-on-accent-focus"
).withDefault(
    (element: HTMLElement) =>
        foregroundOnAccentRecipe.getValueFor(element).evaluate(element).focus
);

// Accent Foreground

/** @public */
export const accentForegroundMinContrast = createNonCss<number>(
    "accent-foreground-min-contrast"
).withDefault(ContrastTarget.NormalText);

/** @public */
export const accentForegroundRestDelta = createNonCss<number>(
    "accent-foreground-rest-delta"
).withDefault(0);

/** @public */
export const accentForegroundHoverDelta = createNonCss<number>(
    "accent-foreground-hover-delta"
).withDefault(3);

/** @public */
export const accentForegroundActiveDelta = createNonCss<number>(
    "accent-foreground-active-delta"
).withDefault(-8);

/** @public */
export const accentForegroundFocusDelta = createNonCss<number>(
    "accent-foreground-focus-delta"
).withDefault(0);

/** @public */
export const accentForegroundRecipe = createNonCss<InteractiveColorRecipe>(
    "accent-foreground-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            accentPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            accentForegroundMinContrast.getValueFor(element),
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

// Neutral Foreground

/** @public */
export const neutralForegroundMinContrast = createNonCss<number>(
    "neutral-foreground-min-contrast"
).withDefault(16);

/** @public */
export const neutralForegroundRestDelta = createNonCss<number>(
    "neutral-foreground-rest-delta"
).withDefault(0);

/** @public */
export const neutralForegroundHoverDelta = createNonCss<number>(
    "neutral-foreground-hover-delta"
).withDefault(-19);

/** @public */
export const neutralForegroundActiveDelta = createNonCss<number>(
    "neutral-foreground-active-delta"
).withDefault(-30);

/** @public */
export const neutralForegroundFocusDelta = createNonCss<number>(
    "neutral-foreground-focus-delta"
).withDefault(0);

/** @public */
export const neutralForegroundRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-foreground-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralForegroundMinContrast.getValueFor(element),
            neutralForegroundRestDelta.getValueFor(element),
            neutralForegroundHoverDelta.getValueFor(element),
            neutralForegroundActiveDelta.getValueFor(element),
            neutralForegroundFocusDelta.getValueFor(element)
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

// Neutral Foreground Hint

/** @public */
export const neutralForegroundHintRecipe = createNonCss<ColorRecipe>(
    "neutral-foreground-hint-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): Swatch =>
        contrastSwatch(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            ContrastTarget.NormalText
        ),
});

/** @public */
export const neutralForegroundHint = create<Swatch>(
    "neutral-foreground-hint"
).withDefault((element: HTMLElement) =>
    neutralForegroundHintRecipe.getValueFor(element).evaluate(element)
);

// Neutral Fill

/** @public */
export const neutralFillRestDelta = createNonCss<number>(
    "neutral-fill-rest-delta"
).withDefault(-1);

/** @public */
export const neutralFillHoverDelta = createNonCss<number>(
    "neutral-fill-hover-delta"
).withDefault(1);

/** @public */
export const neutralFillActiveDelta = createNonCss<number>(
    "neutral-fill-active-delta"
).withDefault(0);

/** @public */
export const neutralFillFocusDelta = createNonCss<number>(
    "neutral-fill-focus-delta"
).withDefault(0);

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
export const neutralFillInputRestDelta = createNonCss<number>(
    "neutral-fill-input-rest-delta"
).withDefault(-1);

/** @public */
export const neutralFillInputHoverDelta = createNonCss<number>(
    "neutral-fill-input-hover-delta"
).withDefault(1);

/** @public */
export const neutralFillInputActiveDelta = createNonCss<number>(
    "neutral-fill-input-active-delta"
).withDefault(0);

/** @public */
export const neutralFillInputFocusDelta = createNonCss<number>(
    "neutral-fill-input-focus-delta"
).withDefault(-2);

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

// Neutral Fill Secondary

/** @public */
export const neutralFillSecondaryRestDelta = createNonCss<number>(
    "neutral-fill-secondary-rest-delta"
).withDefault(3);

/** @public */
export const neutralFillSecondaryHoverDelta = createNonCss<number>(
    "neutral-fill-secondary-hover-delta"
).withDefault(2);

/** @public */
export const neutralFillSecondaryActiveDelta = createNonCss<number>(
    "neutral-fill-secondary-active-delta"
).withDefault(1);

/** @public */
export const neutralFillSecondaryFocusDelta = createNonCss<number>(
    "neutral-fill-secondary-focus-delta"
).withDefault(3);

/** @public */
export const neutralFillSecondaryRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-fill-secondary-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        deltaSwatchSet(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralFillSecondaryRestDelta.getValueFor(element),
            neutralFillSecondaryHoverDelta.getValueFor(element),
            neutralFillSecondaryActiveDelta.getValueFor(element),
            neutralFillSecondaryFocusDelta.getValueFor(element)
        ),
});

/** @public */
export const neutralFillSecondaryRest = create<Swatch>(
    "neutral-fill-secondary-rest"
).withDefault(
    (element: HTMLElement) =>
        neutralFillSecondaryRecipe.getValueFor(element).evaluate(element).rest
);

/** @public */
export const neutralFillSecondaryHover = create<Swatch>(
    "neutral-fill-secondary-hover"
).withDefault(
    (element: HTMLElement) =>
        neutralFillSecondaryRecipe.getValueFor(element).evaluate(element).hover
);

/** @public */
export const neutralFillSecondaryActive = create<Swatch>(
    "neutral-fill-secondary-active"
).withDefault(
    (element: HTMLElement) =>
        neutralFillSecondaryRecipe.getValueFor(element).evaluate(element).active
);

/** @public */
export const neutralFillSecondaryFocus = create<Swatch>(
    "neutral-fill-secondary-focus"
).withDefault(
    (element: HTMLElement) =>
        neutralFillSecondaryRecipe.getValueFor(element).evaluate(element).focus
);

// Neutral Fill Stealth

/** @public */
export const neutralFillStealthRestDelta = createNonCss<number>(
    "neutral-fill-stealth-rest-delta"
).withDefault(0);

/** @public */
export const neutralFillStealthHoverDelta = createNonCss<number>(
    "neutral-fill-stealth-hover-delta"
).withDefault(3);

/** @public */
export const neutralFillStealthActiveDelta = createNonCss<number>(
    "neutral-fill-stealth-active-delta"
).withDefault(2);

/** @public */
export const neutralFillStealthFocusDelta = createNonCss<number>(
    "neutral-fill-stealth-focus-delta"
).withDefault(0);

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
export const neutralFillStrongMinContrast = createNonCss<number>(
    "neutral-fill-strong-min-contrast"
).withDefault(3);

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
export const neutralFillStrongRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-fill-strong-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralFillStrongMinContrast.getValueFor(element),
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

// Neutral Stroke

/** @public */
export const neutralStrokeRestDelta = createNonCss<number>(
    "neutral-stroke-rest-delta"
).withDefault(8);

/** @public */
export const neutralStrokeHoverDelta = createNonCss<number>(
    "neutral-stroke-hover-delta"
).withDefault(12);

/** @public */
export const neutralStrokeActiveDelta = createNonCss<number>(
    "neutral-stroke-active-delta"
).withDefault(6);

/** @public */
export const neutralStrokeFocusDelta = createNonCss<number>(
    "neutral-stroke-focus-delta"
).withDefault(8);

/** @public */
export const neutralStrokeRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-stroke-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet => {
        return deltaSwatchSet(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralStrokeRestDelta.getValueFor(element),
            neutralStrokeHoverDelta.getValueFor(element),
            neutralStrokeActiveDelta.getValueFor(element),
            neutralStrokeFocusDelta.getValueFor(element)
        );
    },
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

// Neutral Stroke Divider

/** @public */
export const neutralStrokeDividerRestDelta = createNonCss<number>(
    "neutral-stroke-divider-rest-delta"
).withDefault(4);

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

// Neutral Stroke Input

/** @public */
export const neutralStrokeInputRestDelta = createNonCss<number>(
    "neutral-stroke-input-rest-delta"
).withDefault(3);

/** @public */
export const neutralStrokeInputHoverDelta = createNonCss<number>(
    "neutral-stroke-input-hover-delta"
).withDefault(5);

/** @public */
export const neutralStrokeInputActiveDelta = createNonCss<number>(
    "neutral-stroke-input-active-delta"
).withDefault(5);

/** @public */
export const neutralStrokeInputFocusDelta = createNonCss<number>(
    "neutral-stroke-input-focus-delta"
).withDefault(5);

/** @public */
export const neutralStrokeInputRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-stroke-input-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet => {
        return deltaSwatchSet(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralStrokeInputRestDelta.getValueFor(element),
            neutralStrokeInputHoverDelta.getValueFor(element),
            neutralStrokeInputActiveDelta.getValueFor(element),
            neutralStrokeInputFocusDelta.getValueFor(element)
        );
    },
});

/** @public */
export const neutralStrokeInputRest = create<Swatch>(
    "neutral-stroke-input-rest"
).withDefault(
    (element: HTMLElement) =>
        neutralStrokeInputRecipe.getValueFor(element).evaluate(element).rest
);

/** @public */
export const neutralStrokeInputHover = create<Swatch>(
    "neutral-stroke-input-hover"
).withDefault(
    (element: HTMLElement) =>
        neutralStrokeInputRecipe.getValueFor(element).evaluate(element).hover
);

/** @public */
export const neutralStrokeInputActive = create<Swatch>(
    "neutral-stroke-input-active"
).withDefault(
    (element: HTMLElement) =>
        neutralStrokeInputRecipe.getValueFor(element).evaluate(element).active
);

/** @public */
export const neutralStrokeInputFocus = create<Swatch>(
    "neutral-stroke-input-focus"
).withDefault(
    (element: HTMLElement) =>
        neutralStrokeInputRecipe.getValueFor(element).evaluate(element).focus
);

// Neutral Stroke Strong

/** @public */
export const neutralStrokeStrongMinContrast = createNonCss<number>(
    "neutral-stroke-strong-min-contrast"
).withDefault(5.5);

/** @public */
export const neutralStrokeStrongRestDelta = createNonCss<number>(
    "neutral-stroke-strong-rest-delta"
).withDefault(0);

/** @public */
export const neutralStrokeStrongHoverDelta = createNonCss<number>(
    "neutral-stroke-strong-hover-delta"
).withDefault(0);

/** @public */
export const neutralStrokeStrongActiveDelta = createNonCss<number>(
    "neutral-stroke-strong-active-delta"
).withDefault(0);

/** @public */
export const neutralStrokeStrongFocusDelta = createNonCss<number>(
    "neutral-stroke-strong-focus-delta"
).withDefault(0);

/** @public */
export const neutralStrokeStrongRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-stroke-strong-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            neutralPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            neutralStrokeStrongMinContrast.getValueFor(element),
            neutralStrokeStrongRestDelta.getValueFor(element),
            neutralStrokeStrongHoverDelta.getValueFor(element),
            neutralStrokeStrongActiveDelta.getValueFor(element),
            neutralStrokeStrongFocusDelta.getValueFor(element)
        ),
});

/** @public */
export const neutralStrokeStrongRest = create<Swatch>(
    "neutral-stroke-strong-rest"
).withDefault(
    (element: HTMLElement) =>
        neutralStrokeStrongRecipe.getValueFor(element).evaluate(element).rest
);

/** @public */
export const neutralStrokeStrongHover = create<Swatch>(
    "neutral-stroke-strong-hover"
).withDefault(
    (element: HTMLElement) =>
        neutralStrokeStrongRecipe.getValueFor(element).evaluate(element).hover
);

/** @public */
export const neutralStrokeStrongActive = create<Swatch>(
    "neutral-stroke-strong-active"
).withDefault(
    (element: HTMLElement) =>
        neutralStrokeStrongRecipe.getValueFor(element).evaluate(element).active
);

/** @public */
export const neutralStrokeStrongFocus = create<Swatch>(
    "neutral-stroke-strong-focus"
).withDefault(
    (element: HTMLElement) =>
        neutralStrokeStrongRecipe.getValueFor(element).evaluate(element).focus
);

// Focus Stroke Outer

/** @public */
export const focusStrokeOuterRecipe = createNonCss<ColorRecipe>(
    "focus-stroke-outer-recipe"
).withDefault({
    evaluate: (element: HTMLElement): Swatch =>
        blackOrWhiteByContrast(
            fillColor.getValueFor(element),
            ContrastTarget.NormalText,
            true
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
        blackOrWhiteByContrast(
            focusStrokeOuter.getValueFor(element),
            ContrastTarget.NormalText,
            false
        ),
});

/** @public */
export const focusStrokeInner = create<Swatch>(
    "focus-stroke-inner"
).withDefault((element: HTMLElement) =>
    focusStrokeInnerRecipe.getValueFor(element).evaluate(element)
);
