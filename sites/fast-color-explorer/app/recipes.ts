import { accentFill as accentFillAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/accent-fill";
import { accentForeground as accentForegroundAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/accent-foreground";
import { accentForegroundCut as accentForegroundCutAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/accent-foreground-cut";
import { neutralDivider as neutralDividerAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-divider";
import { neutralFill as neutralFillAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-fill";
import { neutralFillCard as neutralFillCardAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-fill-card";
import { neutralFillInput as neutralFillInputAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-fill-input";
import { neutralFillStealth as neutralFillStealthAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-fill-stealth";
import { neutralFillToggle as neutralFillToggleAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-fill-toggle";
import { neutralFocus as neutralFocusAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-focus";
import { neutralFocusInnerAccent as neutralFocusInnerAccentAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-focus-inner-accent";
import { neutralForeground as neutralForegroundAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-foreground";
import { neutralForegroundHint as neutralForegroundHintAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-foreground-hint";
import { neutralOutline as neutralOutlineAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-outline";
import { neutralLayerCardContainer as neutralLayerCardContainerAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-layer-card-container";
import { neutralLayerFloating as neutralLayerFloatingAlgorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-layer-floating";
import { neutralLayerL1 as neutralLayerL1Algorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-layer-L1";
import { neutralLayerL2 as neutralLayerL2Algorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-layer-L2";
import { neutralLayerL3 as neutralLayerL3Algorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-layer-L3";
import { neutralLayerL4 as neutralLayerL4Algorithm } from "@microsoft/fast-components/dist/esm/color-vNext/recipes/neutral-layer-L4";
import { ColorsDesignSystem, swatchToSwatchRGB } from "./design-system";

// This file exists as an interop between the new color recipes and the legacy design system support.

// TODO: Migrate the Color Explorer to web components. You get to celebrate by deleting this file! :D

const accentFill = (d?: ColorsDesignSystem): any => {
    return accentFillAlgorithm(
        d?.accentPaletteRGB,
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        accentForegroundCutAlgorithm(
            swatchToSwatchRGB(d?.backgroundColor as string),
            4.5
        ),
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

export const accentForegroundCut = (d?: ColorsDesignSystem): string => {
    return accentForegroundCutAlgorithm(swatchToSwatchRGB(accentFillHover(d)), 4.5)
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

export const neutralFillCardRest = (d?: ColorsDesignSystem): string => {
    return neutralFillCardAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        d?.neutralFillCardDelta
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

const neutralFillToggle = (d?: ColorsDesignSystem): any => {
    return neutralFillToggleAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        0,
        d?.neutralFillToggleHoverDelta,
        d?.neutralFillToggleActiveDelta,
        d?.neutralFillToggleFocusDelta
    );
};

export const neutralFillToggleRest = (d?: ColorsDesignSystem): string => {
    return neutralFillToggle(d).rest.toColorString().toUpperCase();
};
export const neutralFillToggleHover = (d?: ColorsDesignSystem): string => {
    return neutralFillToggle(d).hover.toColorString().toUpperCase();
};
export const neutralFillToggleActive = (d?: ColorsDesignSystem): string => {
    return neutralFillToggle(d).active.toColorString().toUpperCase();
};
export const neutralFillToggleFocus = (d?: ColorsDesignSystem): string => {
    return neutralFillToggle(d).focus.toColorString().toUpperCase();
};

export const neutralFocus = (d?: ColorsDesignSystem): string => {
    return neutralFocusAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string)
    )
        .toColorString()
        .toUpperCase();
};

export const neutralFocusInnerAccent = (d?: ColorsDesignSystem): string => {
    return neutralFocusInnerAccentAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        neutralFocusAlgorithm(
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

const neutralOutline = (d?: ColorsDesignSystem): any => {
    return neutralOutlineAlgorithm(
        d?.neutralPaletteRGB,
        swatchToSwatchRGB(d?.backgroundColor as string),
        d?.neutralOutlineRestDelta,
        d?.neutralOutlineHoverDelta,
        d?.neutralOutlineActiveDelta,
        d?.neutralOutlineFocusDelta
    );
};

export const neutralOutlineRest = (d?: ColorsDesignSystem): string => {
    return neutralOutline(d).rest.toColorString().toUpperCase();
};
export const neutralOutlineHover = (d?: ColorsDesignSystem): string => {
    return neutralOutline(d).hover.toColorString().toUpperCase();
};
export const neutralOutlineActive = (d?: ColorsDesignSystem): string => {
    return neutralOutline(d).active.toColorString().toUpperCase();
};
export const neutralOutlineFocus = (d?: ColorsDesignSystem): string => {
    return neutralOutline(d).focus.toColorString().toUpperCase();
};

export const neutralLayerCardContainer = (d?: ColorsDesignSystem): string => {
    return neutralLayerCardContainerAlgorithm(
        d?.neutralPaletteRGB,
        d?.baseLayerLuminance,
        d?.neutralFillCardDelta
    )
        .toColorString()
        .toUpperCase();
};

export const neutralLayerFloating = (d?: ColorsDesignSystem): string => {
    return neutralLayerFloatingAlgorithm(
        d?.neutralPaletteRGB,
        d?.baseLayerLuminance,
        d?.neutralFillCardDelta
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
        d?.neutralFillCardDelta,
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
        d?.neutralFillCardDelta,
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
        d?.neutralFillCardDelta,
        d?.neutralFillRestDelta,
        d?.neutralFillHoverDelta,
        d?.neutralFillActiveDelta
    )
        .toColorString()
        .toUpperCase();
};
