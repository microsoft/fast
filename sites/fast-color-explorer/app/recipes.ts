import { contrastRatio, parseColor } from "@microsoft/fast-colors";
import { accentFill as accentFillAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/accent-fill";
import { accentForeground as accentForegroundAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/accent-foreground";
import { foregroundOnAccent as foregroundOnAccentAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/foreground-on-accent";
import { neutralDivider as neutralDividerAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-divider";
import { neutralFill as neutralFillAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-fill";
import { neutralFillLayer as neutralFillLayerAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-fill-layer";
import { neutralFillInput as neutralFillInputAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-fill-input";
import { neutralFillStealth as neutralFillStealthAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-fill-stealth";
import { neutralFillContrast as neutralFillContrastAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-fill-contrast";
import {
    focusStrokeInner as focusStrokeInnerAlgorithm,
    focusStrokeOuter as focusStrokeOuterAlgorithm,
} from "@microsoft/fast-components/dist/esm/color-vNext/recipes/focus-stroke";
import { neutralForeground as neutralForegroundAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-foreground";
import { neutralForegroundHint as neutralForegroundHintAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-foreground-hint";
import { neutralLayerCardContainer as neutralLayerCardContainerAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-layer-card-container";
import { neutralLayerFloating as neutralLayerFloatingAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-layer-floating";
import { neutralLayerL1 as neutralLayerL1Algorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-layer-L1";
import { neutralLayerL2 as neutralLayerL2Algorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-layer-L2";
import { neutralLayerL3 as neutralLayerL3Algorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-layer-L3";
import { neutralLayerL4 as neutralLayerL4Algorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-layer-L4";
import { neutralStroke as neutralStrokeAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-stroke";
import { ColorsDesignSystem, swatchToSwatchRGB } from "./design-system";

export type Swatch = string;
export type DesignSystemResolver<T, Y = ColorsDesignSystem> = (d: Y) => T;
export type SwatchResolver = DesignSystemResolver<Swatch>;
/**
 * A function type that resolves a Swatch from a SwatchResolver
 * and applies it to the backgroundColor property of the design system
 * of the returned DesignSystemResolver
 * @internal
 */
export type DesignSystemResolverFromSwatchResolver<T> = (
    resolver: SwatchResolver
) => DesignSystemResolver<T>;

/**
 * A function type that resolves a Swatch from a string literal
 * and applies it to the backgroundColor property of the design system
 * of the returned DesignSystemResolver
 */
export type DesignSystemResolverFromSwatch<T> = (
    colorLiteral: string
) => DesignSystemResolver<T>;

/**
 * The states that a swatch can have
 * @internal
 */
export enum SwatchFamilyType {
    rest = "rest",
    hover = "hover",
    active = "active",
    focus = "focus",
    selected = "selected",
}

/**
 * A function that resolves a color when provided a design system
 * or resolves a ColorRecipe when provided a SwatchResolver
 */
export type ColorRecipe<T> = DesignSystemResolver<T> &
    DesignSystemResolverFromSwatchResolver<T> &
    DesignSystemResolverFromSwatch<T>;

export type SwatchRecipe = ColorRecipe<Swatch>;

// This file exists as an interop between the new color recipes and the legacy design system support.

// TODO: Migrate the Color Explorer to web components. You get to celebrate by deleting this file! :D

const accentFill = (d?: ColorsDesignSystem): any => {
    return accentFillAlgorithm(
        d?.accentPaletteRGB,
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        foregroundOnAccentAlgorithm(swatchToSwatchRGB(d?.backgroundColor as string), 4.5),
        4.5,
        d?.accentFillHoverDelta,
        d?.accentFillActiveDelta,
        d?.accentFillFocusDelta,
        0,
        d?.neutralFillRestDelta,
        d?.neutralFillHoverDelta,
        d?.neutralFillActiveDelta
    );
};

export const accentFillRest = (d?: ColorsDesignSystem): string => {
    return accentFill(d).rest.toColorString().toUpperCase();
};
export const accentFillHover = (d?: ColorsDesignSystem): string => {
    return accentFill(d).hover.toColorString().toUpperCase();
};
export const accentFillActive = (d?: ColorsDesignSystem): string => {
    return accentFill(d).active.toColorString().toUpperCase();
};
export const accentFillFocus = (d?: ColorsDesignSystem): string => {
    return accentFill(d).focus.toColorString().toUpperCase();
};

const accentForeground = (d?: ColorsDesignSystem): any => {
    return accentForegroundAlgorithm(
        d?.accentPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        4.5,
        d?.accentForegroundRestDelta,
        d?.accentForegroundHoverDelta,
        d?.accentForegroundActiveDelta,
        d?.accentForegroundFocusDelta
    );
};

export const accentForegroundRest = (d?: ColorsDesignSystem): string => {
    return accentForeground(d).rest.toColorString().toUpperCase();
};
export const accentForegroundHover = (d?: ColorsDesignSystem): string => {
    return accentForeground(d).hover.toColorString().toUpperCase();
};
export const accentForegroundActive = (d?: ColorsDesignSystem): string => {
    return accentForeground(d).active.toColorString().toUpperCase();
};
export const accentForegroundFocus = (d?: ColorsDesignSystem): string => {
    return accentForeground(d).focus.toColorString().toUpperCase();
};

export const foregroundOnAccent = (d?: ColorsDesignSystem): string => {
    return foregroundOnAccentAlgorithm(swatchToSwatchRGB(accentFillHover(d)), 4.5)
        .toColorString()
        .toUpperCase();
};

export const neutralDividerRest = (d?: ColorsDesignSystem): string => {
    return neutralDividerAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        d?.neutralDividerRestDelta
    )
        .toColorString()
        .toUpperCase();
};

const neutralFill = (d?: ColorsDesignSystem): any => {
    return neutralFillAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        d?.neutralFillRestDelta,
        d?.neutralFillHoverDelta,
        d?.neutralFillActiveDelta,
        d?.neutralFillFocusDelta,
        0
    );
};

export const neutralFillRest = (d?: ColorsDesignSystem): string => {
    return neutralFill(d).rest.toColorString().toUpperCase();
};
export const neutralFillHover = (d?: ColorsDesignSystem): string => {
    return neutralFill(d).hover.toColorString().toUpperCase();
};
export const neutralFillActive = (d?: ColorsDesignSystem): string => {
    return neutralFill(d).active.toColorString().toUpperCase();
};
export const neutralFillFocus = (d?: ColorsDesignSystem): string => {
    return neutralFill(d).focus.toColorString().toUpperCase();
};

export const neutralFillLayerRest = (d?: ColorsDesignSystem): string => {
    return neutralFillLayerAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        d?.neutralFillLayerDelta
    )
        .toColorString()
        .toUpperCase();
};

const neutralFillInput = (d?: ColorsDesignSystem): any => {
    return neutralFillInputAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        d?.neutralFillInputRestDelta,
        d?.neutralFillInputHoverDelta,
        d?.neutralFillInputActiveDelta,
        d?.neutralFillInputFocusDelta,
        0
    );
};

export const neutralFillInputRest = (d?: ColorsDesignSystem): string => {
    return neutralFillInput(d).rest.toColorString().toUpperCase();
};
export const neutralFillInputHover = (d?: ColorsDesignSystem): string => {
    return neutralFillInput(d).hover.toColorString().toUpperCase();
};
export const neutralFillInputActive = (d?: ColorsDesignSystem): string => {
    return neutralFillInput(d).active.toColorString().toUpperCase();
};
export const neutralFillInputFocus = (d?: ColorsDesignSystem): string => {
    return neutralFillInput(d).focus.toColorString().toUpperCase();
};

const neutralFillStealth = (d?: ColorsDesignSystem): any => {
    return neutralFillStealthAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        d?.neutralFillStealthRestDelta,
        d?.neutralFillStealthHoverDelta,
        d?.neutralFillStealthActiveDelta,
        d?.neutralFillStealthFocusDelta,
        0
    );
};

export const neutralFillStealthRest = (d?: ColorsDesignSystem): string => {
    return neutralFillStealth(d).rest.toColorString().toUpperCase();
};
export const neutralFillStealthHover = (d?: ColorsDesignSystem): string => {
    return neutralFillStealth(d).hover.toColorString().toUpperCase();
};
export const neutralFillStealthActive = (d?: ColorsDesignSystem): string => {
    return neutralFillStealth(d).active.toColorString().toUpperCase();
};
export const neutralFillStealthFocus = (d?: ColorsDesignSystem): string => {
    return neutralFillStealth(d).focus.toColorString().toUpperCase();
};

const neutralFillStrong = (d?: ColorsDesignSystem): any => {
    return neutralFillContrastAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        0,
        d?.neutralFillStrongHoverDelta,
        d?.neutralFillStrongActiveDelta,
        d?.neutralFillStrongFocusDelta
    );
};

export const neutralFillStrongRest = (d?: ColorsDesignSystem): string => {
    return neutralFillStrong(d).rest.toColorString().toUpperCase();
};
export const neutralFillStrongHover = (d?: ColorsDesignSystem): string => {
    return neutralFillStrong(d).hover.toColorString().toUpperCase();
};
export const neutralFillStrongActive = (d?: ColorsDesignSystem): string => {
    return neutralFillStrong(d).active.toColorString().toUpperCase();
};
export const neutralFillStrongFocus = (d?: ColorsDesignSystem): string => {
    return neutralFillStrong(d).focus.toColorString().toUpperCase();
};

export const focusStrokeOuter = (d?: ColorsDesignSystem): string => {
    return focusStrokeOuterAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string)
    )
        .toColorString()
        .toUpperCase();
};

export const focusStrokeInner = (d?: ColorsDesignSystem): string => {
    return focusStrokeInnerAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        focusStrokeOuterAlgorithm(
            d?.neutralPaletteRGB,
            swatchToSwatchRGB(d?.backgroundColor as string)
        )
    )
        .toColorString()
        .toUpperCase();
};

export const neutralForegroundHint = (d?: ColorsDesignSystem): string => {
    return neutralForegroundHintAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string)
    )
        .toColorString()
        .toUpperCase();
};

export const neutralForegroundRest = (d?: ColorsDesignSystem): string => {
    return neutralForegroundAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string)
    )
        .toColorString()
        .toUpperCase();
};

const neutralStroke = (d?: ColorsDesignSystem): any => {
    return neutralStrokeAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        d?.neutralStrokeRestDelta,
        d?.neutralStrokeHoverDelta,
        d?.neutralStrokeActiveDelta,
        d?.neutralStrokeFocusDelta
    );
};

export const neutralStrokeRest = (d?: ColorsDesignSystem): string => {
    return neutralStroke(d).rest.toColorString().toUpperCase();
};
export const neutralStrokeHover = (d?: ColorsDesignSystem): string => {
    return neutralStroke(d).hover.toColorString().toUpperCase();
};
export const neutralStrokeActive = (d?: ColorsDesignSystem): string => {
    return neutralStroke(d).active.toColorString().toUpperCase();
};
export const neutralStrokeFocus = (d?: ColorsDesignSystem): string => {
    return neutralStroke(d).focus.toColorString().toUpperCase();
};

export const neutralLayerCardContainer = (d?: ColorsDesignSystem): string => {
    return neutralLayerCardContainerAlgorithm(
        d?.neutralPaletteRGB,
        d?.baseLayerLuminance,
        d?.neutralFillLayerDelta
    )
        .toColorString()
        .toUpperCase();
};

export const neutralLayerFloating = (d?: ColorsDesignSystem): string => {
    return neutralLayerFloatingAlgorithm(
        d?.neutralPaletteRGB,
        d?.baseLayerLuminance,
        d?.neutralFillLayerDelta
    )
        .toColorString()
        .toUpperCase();
};

export const neutralLayerL1 = (d?: ColorsDesignSystem): string => {
    return neutralLayerL1Algorithm(d?.neutralPaletteRGB, d?.baseLayerLuminance)
        .toColorString()
        .toUpperCase();
};

export const neutralLayerL2 = (d?: ColorsDesignSystem): string => {
    return neutralLayerL2Algorithm(
        d?.neutralPaletteRGB,
        d?.baseLayerLuminance,
        d?.neutralFillLayerDelta,
        d?.neutralFillRestDelta,
        d?.neutralFillHoverDelta,
        d?.neutralFillActiveDelta
    )
        .toColorString()
        .toUpperCase();
};

export const neutralLayerL3 = (d?: ColorsDesignSystem): string => {
    return neutralLayerL3Algorithm(
        d?.neutralPaletteRGB,
        d?.baseLayerLuminance,
        d?.neutralFillLayerDelta,
        d?.neutralFillRestDelta,
        d?.neutralFillHoverDelta,
        d?.neutralFillActiveDelta
    )
        .toColorString()
        .toUpperCase();
};

export const neutralLayerL4 = (d?: ColorsDesignSystem): string => {
    return neutralLayerL4Algorithm(
        d?.neutralPaletteRGB,
        d?.baseLayerLuminance,
        d?.neutralFillLayerDelta,
        d?.neutralFillRestDelta,
        d?.neutralFillHoverDelta,
        d?.neutralFillActiveDelta
    )
        .toColorString()
        .toUpperCase();
};

export function backgroundColor(d?: ColorsDesignSystem): string {
    return d?.backgroundColor || "#FFFFFF";
}

/**
 * Returns the contrast value between two color strings.
 * Supports #RRGGBB and rgb(r, g, b) formats.
 * @internal
 */
export function contrast(a: string, b: string): number {
    return contrastRatio(parseColor(a)!, parseColor(b)!);
}
