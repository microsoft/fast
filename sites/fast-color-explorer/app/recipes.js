import { contrastRatio, parseColor } from "@microsoft/fast-colors";
import { accentFill as accentFillAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/accent-fill";
import { accentForeground as accentForegroundAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/accent-foreground";
import { foregroundOnAccent as foregroundOnAccentAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/foreground-on-accent";
import { neutralFill as neutralFillAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-fill";
import { neutralFillLayer as neutralFillLayerAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-layer";
import { neutralFillInput as neutralFillInputAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-input";
import { neutralFillStealth as neutralFillStealthAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-stealth";
import { neutralFillContrast as neutralFillContrastAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-fill-contrast";
import {
    focusStrokeInner as focusStrokeInnerAlgorithm,
    focusStrokeOuter as focusStrokeOuterAlgorithm,
} from "@microsoft/fast-components/dist/esm/color/recipes/focus-stroke";
import { neutralForeground as neutralForegroundAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-foreground";
import { neutralForegroundHint as neutralForegroundHintAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-foreground-hint";
import { neutralLayerCardContainer as neutralLayerCardContainerAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-card-container";
import { neutralLayerFloating as neutralLayerFloatingAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-floating";
import { neutralLayer1 as neutralLayer1Algorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-1";
import { neutralLayer2 as neutralLayer2Algorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-2";
import { neutralLayer3 as neutralLayer3Algorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-3";
import { neutralLayer4 as neutralLayer4Algorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-layer-4";
import { neutralStroke as neutralStrokeAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-stroke";
import { neutralStrokeDivider as neutralStrokeDividerAlgorithm } from "@microsoft/fast-components/dist/esm/color/recipes/neutral-stroke-divider";
import { swatchToSwatchRGB } from "./design-system";
/**
 * The states that a swatch can have
 * @internal
 */
export var SwatchFamilyType;
(function (SwatchFamilyType) {
    SwatchFamilyType["rest"] = "rest";
    SwatchFamilyType["hover"] = "hover";
    SwatchFamilyType["active"] = "active";
    SwatchFamilyType["focus"] = "focus";
})(SwatchFamilyType || (SwatchFamilyType = {}));
// This file exists as an interop between the new color recipes and the legacy design system support.
// TODO: Migrate the Color Explorer to web components. You get to celebrate by deleting this file! :D
const accentFill = d => {
    return accentFillAlgorithm(
        d === null || d === void 0 ? void 0 : d.accentPaletteRGB,
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor),
        foregroundOnAccentAlgorithm(
            swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor),
            4.5
        ),
        4.5,
        d === null || d === void 0 ? void 0 : d.accentFillHoverDelta,
        d === null || d === void 0 ? void 0 : d.accentFillActiveDelta,
        d === null || d === void 0 ? void 0 : d.accentFillFocusDelta,
        0,
        d === null || d === void 0 ? void 0 : d.neutralFillRestDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillHoverDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillActiveDelta
    );
};
export const accentFillRest = d => {
    return accentFill(d).rest.toColorString().toUpperCase();
};
export const accentFillHover = d => {
    return accentFill(d).hover.toColorString().toUpperCase();
};
export const accentFillActive = d => {
    return accentFill(d).active.toColorString().toUpperCase();
};
export const accentFillFocus = d => {
    return accentFill(d).focus.toColorString().toUpperCase();
};
const accentForeground = d => {
    return accentForegroundAlgorithm(
        d === null || d === void 0 ? void 0 : d.accentPaletteRGB,
        swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor),
        4.5,
        d === null || d === void 0 ? void 0 : d.accentForegroundRestDelta,
        d === null || d === void 0 ? void 0 : d.accentForegroundHoverDelta,
        d === null || d === void 0 ? void 0 : d.accentForegroundActiveDelta,
        d === null || d === void 0 ? void 0 : d.accentForegroundFocusDelta
    );
};
export const accentForegroundRest = d => {
    return accentForeground(d).rest.toColorString().toUpperCase();
};
export const accentForegroundHover = d => {
    return accentForeground(d).hover.toColorString().toUpperCase();
};
export const accentForegroundActive = d => {
    return accentForeground(d).active.toColorString().toUpperCase();
};
export const accentForegroundFocus = d => {
    return accentForeground(d).focus.toColorString().toUpperCase();
};
export const foregroundOnAccent = d => {
    return foregroundOnAccentAlgorithm(swatchToSwatchRGB(accentFillHover(d)), 4.5)
        .toColorString()
        .toUpperCase();
};
export const neutralStrokeDividerRest = d => {
    return neutralStrokeDividerAlgorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor),
        d === null || d === void 0 ? void 0 : d.neutralStrokeDividerRestDelta
    )
        .toColorString()
        .toUpperCase();
};
const neutralFill = d => {
    return neutralFillAlgorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor),
        d === null || d === void 0 ? void 0 : d.neutralFillRestDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillHoverDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillActiveDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillFocusDelta,
        0
    );
};
export const neutralFillRest = d => {
    return neutralFill(d).rest.toColorString().toUpperCase();
};
export const neutralFillHover = d => {
    return neutralFill(d).hover.toColorString().toUpperCase();
};
export const neutralFillActive = d => {
    return neutralFill(d).active.toColorString().toUpperCase();
};
export const neutralFillFocus = d => {
    return neutralFill(d).focus.toColorString().toUpperCase();
};
export const neutralFillLayerRest = d => {
    return neutralFillLayerAlgorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor),
        d === null || d === void 0 ? void 0 : d.neutralFillLayerDelta
    )
        .toColorString()
        .toUpperCase();
};
const neutralFillInput = d => {
    return neutralFillInputAlgorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor),
        d === null || d === void 0 ? void 0 : d.neutralFillInputRestDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillInputHoverDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillInputActiveDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillInputFocusDelta,
        0
    );
};
export const neutralFillInputRest = d => {
    return neutralFillInput(d).rest.toColorString().toUpperCase();
};
export const neutralFillInputHover = d => {
    return neutralFillInput(d).hover.toColorString().toUpperCase();
};
export const neutralFillInputActive = d => {
    return neutralFillInput(d).active.toColorString().toUpperCase();
};
export const neutralFillInputFocus = d => {
    return neutralFillInput(d).focus.toColorString().toUpperCase();
};
const neutralFillStealth = d => {
    return neutralFillStealthAlgorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor),
        d === null || d === void 0 ? void 0 : d.neutralFillStealthRestDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillStealthHoverDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillStealthActiveDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillStealthFocusDelta,
        0
    );
};
export const neutralFillStealthRest = d => {
    return neutralFillStealth(d).rest.toColorString().toUpperCase();
};
export const neutralFillStealthHover = d => {
    return neutralFillStealth(d).hover.toColorString().toUpperCase();
};
export const neutralFillStealthActive = d => {
    return neutralFillStealth(d).active.toColorString().toUpperCase();
};
export const neutralFillStealthFocus = d => {
    return neutralFillStealth(d).focus.toColorString().toUpperCase();
};
const neutralFillStrong = d => {
    return neutralFillContrastAlgorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor),
        0,
        d === null || d === void 0 ? void 0 : d.neutralFillStrongHoverDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillStrongActiveDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillStrongFocusDelta
    );
};
export const neutralFillStrongRest = d => {
    return neutralFillStrong(d).rest.toColorString().toUpperCase();
};
export const neutralFillStrongHover = d => {
    return neutralFillStrong(d).hover.toColorString().toUpperCase();
};
export const neutralFillStrongActive = d => {
    return neutralFillStrong(d).active.toColorString().toUpperCase();
};
export const neutralFillStrongFocus = d => {
    return neutralFillStrong(d).focus.toColorString().toUpperCase();
};
export const focusStrokeOuter = d => {
    return focusStrokeOuterAlgorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor)
    )
        .toColorString()
        .toUpperCase();
};
export const focusStrokeInner = d => {
    return focusStrokeInnerAlgorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor),
        focusStrokeOuterAlgorithm(
            d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
            swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor)
        )
    )
        .toColorString()
        .toUpperCase();
};
export const neutralForegroundHint = d => {
    return neutralForegroundHintAlgorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor)
    )
        .toColorString()
        .toUpperCase();
};
export const neutralForegroundRest = d => {
    return neutralForegroundAlgorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor)
    )
        .toColorString()
        .toUpperCase();
};
const neutralStroke = d => {
    return neutralStrokeAlgorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        swatchToSwatchRGB(d === null || d === void 0 ? void 0 : d.backgroundColor),
        d === null || d === void 0 ? void 0 : d.neutralStrokeRestDelta,
        d === null || d === void 0 ? void 0 : d.neutralStrokeHoverDelta,
        d === null || d === void 0 ? void 0 : d.neutralStrokeActiveDelta,
        d === null || d === void 0 ? void 0 : d.neutralStrokeFocusDelta
    );
};
export const neutralStrokeRest = d => {
    return neutralStroke(d).rest.toColorString().toUpperCase();
};
export const neutralStrokeHover = d => {
    return neutralStroke(d).hover.toColorString().toUpperCase();
};
export const neutralStrokeActive = d => {
    return neutralStroke(d).active.toColorString().toUpperCase();
};
export const neutralStrokeFocus = d => {
    return neutralStroke(d).focus.toColorString().toUpperCase();
};
export const neutralLayerCardContainer = d => {
    return neutralLayerCardContainerAlgorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        d === null || d === void 0 ? void 0 : d.baseLayerLuminance,
        d === null || d === void 0 ? void 0 : d.neutralFillLayerDelta
    )
        .toColorString()
        .toUpperCase();
};
export const neutralLayerFloating = d => {
    return neutralLayerFloatingAlgorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        d === null || d === void 0 ? void 0 : d.baseLayerLuminance,
        d === null || d === void 0 ? void 0 : d.neutralFillLayerDelta
    )
        .toColorString()
        .toUpperCase();
};
export const neutralLayer1 = d => {
    return neutralLayer1Algorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        d === null || d === void 0 ? void 0 : d.baseLayerLuminance
    )
        .toColorString()
        .toUpperCase();
};
export const neutralLayer2 = d => {
    return neutralLayer2Algorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        d === null || d === void 0 ? void 0 : d.baseLayerLuminance,
        d === null || d === void 0 ? void 0 : d.neutralFillLayerDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillRestDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillHoverDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillActiveDelta
    )
        .toColorString()
        .toUpperCase();
};
export const neutralLayer3 = d => {
    return neutralLayer3Algorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        d === null || d === void 0 ? void 0 : d.baseLayerLuminance,
        d === null || d === void 0 ? void 0 : d.neutralFillLayerDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillRestDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillHoverDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillActiveDelta
    )
        .toColorString()
        .toUpperCase();
};
export const neutralLayer4 = d => {
    return neutralLayer4Algorithm(
        d === null || d === void 0 ? void 0 : d.neutralPaletteRGB,
        d === null || d === void 0 ? void 0 : d.baseLayerLuminance,
        d === null || d === void 0 ? void 0 : d.neutralFillLayerDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillRestDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillHoverDelta,
        d === null || d === void 0 ? void 0 : d.neutralFillActiveDelta
    )
        .toColorString()
        .toUpperCase();
};
export function backgroundColor(d) {
    return (d === null || d === void 0 ? void 0 : d.backgroundColor) || "#FFFFFF";
}
/**
 * Returns the contrast value between two color strings.
 * Supports #RRGGBB and rgb(r, g, b) formats.
 * @internal
 */
export function contrast(a, b) {
    return contrastRatio(parseColor(a), parseColor(b));
}
