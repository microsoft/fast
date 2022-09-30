import { parseColorHexRGB } from "@microsoft/fast-colors";
import { DesignTokenResolver } from "@microsoft/fast-foundation";
import {
    blackOrWhiteByContrast,
    interactiveSwatchSetAsOverlay,
    swatchAsOverlay,
} from "../color/index.js";
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
     * Minimum contrast for normal (&lt;= 14pt) text (AA rating).
     */
    NormalText: 4.5,

    /**
     * Minimum contrast for large (&gt; 14pt) text (AA rating).
     */
    LargeText: 3,
} as const);

/** @public */
export const fillColor = create<Swatch>("fill-color").withDefault(
    SwatchRGB.from(parseColorHexRGB("#FFFFFF")!)
);

/** @public */
export const neutralAsOverlay = createNonCss<boolean>("neutral-as-overlay").withDefault(
    false
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
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(accentFillMinContrast),
            resolve(accentFillRestDelta),
            resolve(accentFillHoverDelta),
            resolve(accentFillActiveDelta),
            resolve(accentFillFocusDelta)
        ),
});

/** @public */
export const accentFillRest = create<Swatch>("accent-fill-rest").withDefault(
    (resolve: DesignTokenResolver) => {
        return resolve(accentFillRecipe).evaluate(resolve).rest;
    }
);

/** @public */
export const accentFillHover = create<Swatch>("accent-fill-hover").withDefault(
    (resolve: DesignTokenResolver) => {
        return resolve(accentFillRecipe).evaluate(resolve).hover;
    }
);

/** @public */
export const accentFillActive = create<Swatch>("accent-fill-active").withDefault(
    (resolve: DesignTokenResolver) => {
        return resolve(accentFillRecipe).evaluate(resolve).active;
    }
);

/** @public */
export const accentFillFocus = create<Swatch>("accent-fill-focus").withDefault(
    (resolve: DesignTokenResolver) => {
        return resolve(accentFillRecipe).evaluate(resolve).focus;
    }
);

// Foreground On Accent

/** @public */
export const foregroundOnAccentRecipe = createNonCss<InteractiveColorRecipe>(
    "foreground-on-accent-recipe"
).withDefault({
    evaluate: (resolve: DesignTokenResolver): InteractiveSwatchSet =>
        blackOrWhiteByContrastSet(
            resolve(accentFillRest),
            resolve(accentFillHover),
            resolve(accentFillActive),
            resolve(accentFillFocus),
            ContrastTarget.NormalText,
            false
        ),
});

/** @public */
export const foregroundOnAccentRest = create<Swatch>(
    "foreground-on-accent-rest"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(foregroundOnAccentRecipe).evaluate(resolve).rest
);

/** @public */
export const foregroundOnAccentHover = create<Swatch>(
    "foreground-on-accent-hover"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(foregroundOnAccentRecipe).evaluate(resolve).hover
);

/** @public */
export const foregroundOnAccentActive = create<Swatch>(
    "foreground-on-accent-active"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(foregroundOnAccentRecipe).evaluate(resolve).active
);

/** @public */
export const foregroundOnAccentFocus = create<Swatch>(
    "foreground-on-accent-focus"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(foregroundOnAccentRecipe).evaluate(resolve).focus
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
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(accentForegroundMinContrast),
            resolve(accentForegroundRestDelta),
            resolve(accentForegroundHoverDelta),
            resolve(accentForegroundActiveDelta),
            resolve(accentForegroundFocusDelta)
        ),
});

/** @public */
export const accentForegroundRest = create<Swatch>("accent-foreground-rest").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(accentForegroundRecipe).evaluate(resolve).rest
);

/** @public */
export const accentForegroundHover = create<Swatch>(
    "accent-foreground-hover"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(accentForegroundRecipe).evaluate(resolve).hover
);

/** @public */
export const accentForegroundActive = create<Swatch>(
    "accent-foreground-active"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(accentForegroundRecipe).evaluate(resolve).active
);

/** @public */
export const accentForegroundFocus = create<Swatch>(
    "accent-foreground-focus"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(accentForegroundRecipe).evaluate(resolve).focus
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
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            contrastAndDeltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralForegroundMinContrast),
                resolve(neutralForegroundRestDelta),
                resolve(neutralForegroundHoverDelta),
                resolve(neutralForegroundActiveDelta),
                resolve(neutralForegroundFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        ),
});

/** @public */
export const neutralForegroundRest = create<Swatch>(
    "neutral-foreground-rest"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralForegroundRecipe).evaluate(resolve).rest
);

/** @public */
export const neutralForegroundHover = create<Swatch>(
    "neutral-foreground-hover"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralForegroundRecipe).evaluate(resolve).hover
);

/** @public */
export const neutralForegroundActive = create<Swatch>(
    "neutral-foreground-active"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralForegroundRecipe).evaluate(resolve).active
);

/** @public */
export const neutralForegroundFocus = create<Swatch>(
    "neutral-foreground-focus"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralForegroundRecipe).evaluate(resolve).focus
);

// Neutral Foreground Hint

/** @public */
export const neutralForegroundHintRecipe = createNonCss<ColorRecipe>(
    "neutral-foreground-hint-recipe"
).withDefault({
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): Swatch =>
        swatchAsOverlay(
            contrastSwatch(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                ContrastTarget.NormalText
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        ),
});

/** @public */
export const neutralForegroundHint = create<Swatch>(
    "neutral-foreground-hint"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(neutralForegroundHintRecipe).evaluate(resolve)
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
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralFillRestDelta),
                resolve(neutralFillHoverDelta),
                resolve(neutralFillActiveDelta),
                resolve(neutralFillFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        ),
});

/** @public */
export const neutralFillRest = create<Swatch>("neutral-fill-rest").withDefault(
    (resolve: DesignTokenResolver) => resolve(neutralFillRecipe).evaluate(resolve).rest
);

/** @public */
export const neutralFillHover = create<Swatch>("neutral-fill-hover").withDefault(
    (resolve: DesignTokenResolver) => resolve(neutralFillRecipe).evaluate(resolve).hover
);

/** @public */
export const neutralFillActive = create<Swatch>("neutral-fill-active").withDefault(
    (resolve: DesignTokenResolver) => resolve(neutralFillRecipe).evaluate(resolve).active
);

/** @public */
export const neutralFillFocus = create<Swatch>("neutral-fill-focus").withDefault(
    (resolve: DesignTokenResolver) => resolve(neutralFillRecipe).evaluate(resolve).focus
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
).withDefault(-2);

/** @public */
export const neutralFillInputFocusDelta = createNonCss<number>(
    "neutral-fill-input-focus-delta"
).withDefault(-2);

/** @public */
export const neutralFillInputRecipe = createNonCss<InteractiveColorRecipe>(
    "neutral-fill-input-recipe"
).withDefault({
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralFillInputRestDelta),
                resolve(neutralFillInputHoverDelta),
                resolve(neutralFillInputActiveDelta),
                resolve(neutralFillInputFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        ),
});

/** @public */
export const neutralFillInputRest = create<Swatch>("neutral-fill-input-rest").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillInputRecipe).evaluate(resolve).rest
);

/** @public */
export const neutralFillInputHover = create<Swatch>(
    "neutral-fill-input-hover"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillInputRecipe).evaluate(resolve).hover
);

/** @public */
export const neutralFillInputActive = create<Swatch>(
    "neutral-fill-input-active"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillInputRecipe).evaluate(resolve).active
);

/** @public */
export const neutralFillInputFocus = create<Swatch>(
    "neutral-fill-input-focus"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillInputRecipe).evaluate(resolve).focus
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
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralFillSecondaryRestDelta),
                resolve(neutralFillSecondaryHoverDelta),
                resolve(neutralFillSecondaryActiveDelta),
                resolve(neutralFillSecondaryFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        ),
});

/** @public */
export const neutralFillSecondaryRest = create<Swatch>(
    "neutral-fill-secondary-rest"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillSecondaryRecipe).evaluate(resolve).rest
);

/** @public */
export const neutralFillSecondaryHover = create<Swatch>(
    "neutral-fill-secondary-hover"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillSecondaryRecipe).evaluate(resolve).hover
);

/** @public */
export const neutralFillSecondaryActive = create<Swatch>(
    "neutral-fill-secondary-active"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillSecondaryRecipe).evaluate(resolve).active
);

/** @public */
export const neutralFillSecondaryFocus = create<Swatch>(
    "neutral-fill-secondary-focus"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillSecondaryRecipe).evaluate(resolve).focus
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
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralFillStealthRestDelta),
                resolve(neutralFillStealthHoverDelta),
                resolve(neutralFillStealthActiveDelta),
                resolve(neutralFillStealthFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        ),
});

/** @public */
export const neutralFillStealthRest = create<Swatch>(
    "neutral-fill-stealth-rest"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillStealthRecipe).evaluate(resolve).rest
);

/** @public */
export const neutralFillStealthHover = create<Swatch>(
    "neutral-fill-stealth-hover"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillStealthRecipe).evaluate(resolve).hover
);

/** @public */
export const neutralFillStealthActive = create<Swatch>(
    "neutral-fill-stealth-active"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillStealthRecipe).evaluate(resolve).active
);

/** @public */
export const neutralFillStealthFocus = create<Swatch>(
    "neutral-fill-stealth-focus"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillStealthRecipe).evaluate(resolve).focus
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
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            contrastAndDeltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralFillStrongMinContrast),
                resolve(neutralFillStrongRestDelta),
                resolve(neutralFillStrongHoverDelta),
                resolve(neutralFillStrongActiveDelta),
                resolve(neutralFillStrongFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        ),
});

/** @public */
export const neutralFillStrongRest = create<Swatch>(
    "neutral-fill-strong-rest"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillStrongRecipe).evaluate(resolve).rest
);

/** @public */
export const neutralFillStrongHover = create<Swatch>(
    "neutral-fill-strong-hover"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillStrongRecipe).evaluate(resolve).hover
);

/** @public */
export const neutralFillStrongActive = create<Swatch>(
    "neutral-fill-strong-active"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillStrongRecipe).evaluate(resolve).active
);

/** @public */
export const neutralFillStrongFocus = create<Swatch>(
    "neutral-fill-strong-focus"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralFillStrongRecipe).evaluate(resolve).focus
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
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralStrokeRestDelta),
                resolve(neutralStrokeHoverDelta),
                resolve(neutralStrokeActiveDelta),
                resolve(neutralStrokeFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        ),
});

/** @public */
export const neutralStrokeRest = create<Swatch>("neutral-stroke-rest").withDefault(
    (resolve: DesignTokenResolver) => resolve(neutralStrokeRecipe).evaluate(resolve).rest
);

/** @public */
export const neutralStrokeHover = create<Swatch>("neutral-stroke-hover").withDefault(
    (resolve: DesignTokenResolver) => resolve(neutralStrokeRecipe).evaluate(resolve).hover
);

/** @public */
export const neutralStrokeActive = create<Swatch>("neutral-stroke-active").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralStrokeRecipe).evaluate(resolve).active
);

/** @public */
export const neutralStrokeFocus = create<Swatch>("neutral-stroke-focus").withDefault(
    (resolve: DesignTokenResolver) => resolve(neutralStrokeRecipe).evaluate(resolve).focus
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
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): Swatch =>
        swatchAsOverlay(
            deltaSwatch(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralStrokeDividerRestDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        ),
});

/** @public */
export const neutralStrokeDividerRest = create<Swatch>(
    "neutral-stroke-divider-rest"
).withDefault(resolve => resolve(neutralStrokeDividerRecipe).evaluate(resolve));

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
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralStrokeInputRestDelta),
                resolve(neutralStrokeInputHoverDelta),
                resolve(neutralStrokeInputActiveDelta),
                resolve(neutralStrokeInputFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        ),
});

/** @public */
export const neutralStrokeInputRest = create<Swatch>(
    "neutral-stroke-input-rest"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralStrokeInputRecipe).evaluate(resolve).rest
);

/** @public */
export const neutralStrokeInputHover = create<Swatch>(
    "neutral-stroke-input-hover"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralStrokeInputRecipe).evaluate(resolve).hover
);

/** @public */
export const neutralStrokeInputActive = create<Swatch>(
    "neutral-stroke-input-active"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralStrokeInputRecipe).evaluate(resolve).active
);

/** @public */
export const neutralStrokeInputFocus = create<Swatch>(
    "neutral-stroke-input-focus"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralStrokeInputRecipe).evaluate(resolve).focus
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
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            contrastAndDeltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralStrokeStrongMinContrast),
                resolve(neutralStrokeStrongRestDelta),
                resolve(neutralStrokeStrongHoverDelta),
                resolve(neutralStrokeStrongActiveDelta),
                resolve(neutralStrokeStrongFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        ),
});

/** @public */
export const neutralStrokeStrongRest = create<Swatch>(
    "neutral-stroke-strong-rest"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralStrokeStrongRecipe).evaluate(resolve).rest
);

/** @public */
export const neutralStrokeStrongHover = create<Swatch>(
    "neutral-stroke-strong-hover"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralStrokeStrongRecipe).evaluate(resolve).hover
);

/** @public */
export const neutralStrokeStrongActive = create<Swatch>(
    "neutral-stroke-strong-active"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralStrokeStrongRecipe).evaluate(resolve).active
);

/** @public */
export const neutralStrokeStrongFocus = create<Swatch>(
    "neutral-stroke-strong-focus"
).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(neutralStrokeStrongRecipe).evaluate(resolve).focus
);

// Focus Stroke Outer

/** @public */
export const focusStrokeOuterRecipe = createNonCss<ColorRecipe>(
    "focus-stroke-outer-recipe"
).withDefault({
    evaluate: (resolve: DesignTokenResolver): Swatch =>
        blackOrWhiteByContrast(resolve(fillColor), ContrastTarget.NormalText, true),
});

/** @public */
export const focusStrokeOuter = create<Swatch>(
    "focus-stroke-outer"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(focusStrokeOuterRecipe).evaluate(resolve)
);

// Focus Stroke Inner

/** @public */
export const focusStrokeInnerRecipe = createNonCss<ColorRecipe>(
    "focus-stroke-inner-recipe"
).withDefault({
    evaluate: (resolve: DesignTokenResolver): Swatch =>
        blackOrWhiteByContrast(
            resolve(focusStrokeOuter),
            ContrastTarget.NormalText,
            false
        ),
});

/** @public */
export const focusStrokeInner = create<Swatch>(
    "focus-stroke-inner"
).withDefault((resolve: DesignTokenResolver) =>
    resolve(focusStrokeInnerRecipe).evaluate(resolve)
);
