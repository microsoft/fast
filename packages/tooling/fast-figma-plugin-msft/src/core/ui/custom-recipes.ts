import {
    accentFillActiveDelta,
    accentFillFocusDelta,
    accentFillHoverDelta,
    accentFillRestDelta,
    accentForegroundActiveDelta,
    accentForegroundFocusDelta,
    accentForegroundHoverDelta,
    accentForegroundRestDelta,
    fillColor,
    InteractiveColorRecipe,
    InteractiveSwatchSet,
    Palette,
    PaletteRGB,
    Swatch,
    SwatchRGB,
} from "@fluentui/web-components";
import { DesignToken } from "@microsoft/fast-foundation";
import { parseColorHexRGB } from "@microsoft/fast-colors";

// Local recipes for use in documentation files.

const target = (-0.1 + Math.sqrt(0.21)) / 2;

function isDark(color: Swatch): boolean {
    return color.relativeLuminance <= target;
}

function directionByIsDark(color: Swatch): 1 | -1 {
    return isDark(color) ? -1 : 1;
}

function contrastAndDeltaSwatchSet(
    palette: Palette,
    reference: Swatch,
    baseContrast: number,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    direction?: -1 | 1 | null
): InteractiveSwatchSet {
    if (direction === null || direction === void 0) {
        direction = directionByIsDark(reference);
    }
    const baseIndex = palette.closestIndexOf(
        palette.colorContrast(reference, baseContrast)
    );

    return {
        rest: palette.get(baseIndex + direction * restDelta),
        hover: palette.get(baseIndex + direction * hoverDelta),
        active: palette.get(baseIndex + direction * activeDelta),
        focus: palette.get(baseIndex + direction * focusDelta),
    };
}

export const docBaseColor = DesignToken.create<Swatch>("doc-base-color").withDefault(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    SwatchRGB.from(parseColorHexRGB("#E1477E")!)
);

export const docPalette = DesignToken.create<Palette>(
    "doc-palette"
).withDefault((element: HTMLElement) =>
    PaletteRGB.from(docBaseColor.getValueFor(element) as SwatchRGB)
);

export const docForegroundRecipe = DesignToken.create<InteractiveColorRecipe>(
    "doc-foreground-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            docPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            4.5,
            accentForegroundRestDelta.getValueFor(element),
            accentForegroundHoverDelta.getValueFor(element),
            accentForegroundActiveDelta.getValueFor(element),
            accentForegroundFocusDelta.getValueFor(element)
        ),
});

export const docForeground = DesignToken.create<Swatch>("doc-foreground").withDefault(
    (element: HTMLElement) =>
        docForegroundRecipe.getValueFor(element).evaluate(element).rest
);

export const docFillRecipe = DesignToken.create<InteractiveColorRecipe>(
    "doc-fill-recipe"
).withDefault({
    evaluate: (element: HTMLElement, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            docPalette.getValueFor(element),
            reference || fillColor.getValueFor(element),
            5,
            accentFillRestDelta.getValueFor(element),
            accentFillHoverDelta.getValueFor(element),
            accentFillActiveDelta.getValueFor(element),
            accentFillFocusDelta.getValueFor(element)
        ),
});

export const docFillRest = DesignToken.create<Swatch>("doc-fill-rest").withDefault(
    (element: HTMLElement) => {
        return docFillRecipe.getValueFor(element).evaluate(element).rest;
    }
);
