import { DesignToken, DI } from "@microsoft/fast-foundation";
import { Direction } from "@microsoft/fast-web-utilities";
import { PaletteRGB } from "./color-vNext/palette";
import { Swatch as SwatchRGB } from "./color-vNext/swatch";
import { accentBase, middleGrey } from "./color-vNext/utilities/color-constants";
import { accentFill as accentFillAlgorithm } from "./color-vNext/recipes/accent-fill";
import { accentForegroundCut as accentForegroundCutAlgorithm } from "./color-vNext/recipes/accent-foreground-cut";
import { accentForeground as accentForegroundAlgorithm } from "./color-vNext/recipes/accent-foreground";

const { create } = DesignToken;

export const accentFillRestDelta = create<number>("accent-fill-rest-delta").withDefault(
    0
);
export const accentFillHoverDelta = create<number>("accent-fill-hover-delta").withDefault(
    4
);
export const accentFillActiveDelta = create<number>(
    "accent-fill-active-delta"
).withDefault(-5);
export const accentFillFocusDelta = create<number>("accent-fill-focus-delta").withDefault(
    0
);
export const accentFillSelectedDelta = create<number>(
    "accent-fill-selected-delta"
).withDefault(12);

export const accentForegroundRestDelta = create<number>(
    "accent-foreground-rest-delta"
).withDefault(0);
export const accentForegroundHoverDelta = create<number>(
    "accent-foreground-hover-delta"
).withDefault(6);
export const accentForegroundActiveDelta = create<number>(
    "accent-foreground-active-delta"
).withDefault(-4);
export const accentForegroundFocusDelta = create<number>(
    "accent-foreground-focus-delta"
).withDefault(0);

export const bodyFont = create<string>("body-font").withDefault("Segoe UI, sans-serif");
export const baseHeightMultiplier = create<number>("base-height-multiplier").withDefault(
    10
);
export const baseHorizontalSpacingMultiplier = create<number>(
    "base-horizontal-spacing-multiplier"
).withDefault(3);
export const baseLayerLuminance = create<number>("base-layer-luminance").withDefault(1);
export const cornerRadius = create<number>("corner-radius").withDefault(3);
export const density = create<number>("density").withDefault(0);
export const designUnit = create<number>("design-unit").withDefault(4);
export const direction = create<Direction>("direction").withDefault(Direction.ltr);
export const disabledOpacity = create<number>("disabled-opacity").withDefault(0.3);
export const focusOutlineWidth = create<number>("focus-outline-width").withDefault(2);

export const neutralDividerRestDelta = create<number>(
    "neutral-divider-rest-delta"
).withDefault(8);

export const neutralFillActiveDelta = create<number>(
    "neutral-fill-active-delta"
).withDefault(5);
export const neutralFillCardDelta = create<number>("neutral-fill-card-delta").withDefault(
    3
);
export const neutralFillFocusDelta = create<number>(
    "neutral-fill-focus-delta"
).withDefault(0);
export const neutralFillHoverDelta = create<number>(
    "neutral-fill-hover-delta"
).withDefault(10);
export const neutralFillInputActiveDelta = create<number>(
    "neutral-fill-input-active-delta"
).withDefault(0);
export const neutralFillInputFocusDelta = create<number>(
    "neutral-fill-input-focus-delta"
).withDefault(0);
export const neutralFillInputHoverDelta = create<number>(
    "neutral-fill-input-hover-delta"
).withDefault(0);
export const neutralFillInputRestDelta = create<number>(
    "neutral-fill-input-rest-delta"
).withDefault(0);
export const neutralFillInputSelectedDelta = create<number>(
    "neutral-fill-input-selected-delta"
).withDefault(0);
export const neutralFillRestDelta = create<number>("neutral-fill-rest-delta").withDefault(
    7
);
export const neutralFillSelectedDelta = create<number>(
    "neutral-fill-selected-delta"
).withDefault(7);
export const neutralFillStealthActiveDelta = create<number>(
    "neutral-fill-stealth-active-delta"
).withDefault(3);
export const neutralFillStealthFocusDelta = create<number>(
    "neutral-fill-stealth-focus-delta"
).withDefault(0);
export const neutralFillStealthHoverDelta = create<number>(
    "neutral-fill-stealth-hover-delta"
).withDefault(5);
export const neutralFillStealthRestDelta = create<number>(
    "neutral-fill-stealth-rest-delta"
).withDefault(0);
export const neutralFillStealthSelectedDelta = create<number>(
    "neutral-fill-stealth-selected-delta"
).withDefault(7);
export const neutralFillToggleActiveDelta = create<number>(
    "neutral-fill-toggle-active-delta"
).withDefault(-5);
export const neutralFillToggleFocusDelta = create<number>(
    "neutral-fill-toggle-focus-delta"
).withDefault(0);
export const neutralFillToggleHoverDelta = create<number>(
    "neutral-fill-toggle-hover-delta"
).withDefault(8);
export const neutralForegroundActiveDelta = create<number>(
    "neutral-foreground-active-delta"
).withDefault(0);
export const neutralForegroundFocusDelta = create<number>(
    "neutral-foreground-focus-delta"
).withDefault(0);
export const neutralForegroundHoverDelta = create<number>(
    "neutral-foreground-hover-delta"
).withDefault(0);
export const neutralOutlineActiveDelta = create<number>(
    "neutral-outline-active-delta"
).withDefault(16);
export const neutralOutlineFocusDelta = create<number>(
    "neutral-outline-focus-delta"
).withDefault(25);
export const neutralOutlineHoverDelta = create<number>(
    "neutral-outline-hover-delta"
).withDefault(40);
export const neutralOutlineRestDelta = create<number>(
    "neutral-outline-rest-delta"
).withDefault(25);
export const outlineWidth = create<number>("outline-width").withDefault(1);
export const typeRampBaseFontSize = create<string>(
    "type-ramp-base-font-size"
).withDefault("14px");
export const typeRampBaseLineHeight = create<string>(
    "type-ramp-base-line-height"
).withDefault("20px");
export const typeRampMinus1FontSize = create<string>(
    "type-ramp-minus1-font-size"
).withDefault("12px");
export const typeRampMinus1LineHeight = create<string>(
    "type-ramp-minus1-line-height"
).withDefault("16px");
export const typeRampMinus2FontSize = create<string>(
    "type-ramp-minus2-font-size"
).withDefault("10px");
export const typeRampMinus2LineHeight = create<string>(
    "type-ramp-minus2-line-height"
).withDefault("16px");
export const typeRampPlus1FontSize = create<string>(
    "type-ramp-plus1-font-size"
).withDefault("16px");
export const typeRampPlus1LineHeight = create<string>(
    "type-ramp-plus1-line-height"
).withDefault("24px");
export const typeRampPlus2FontSize = create<string>(
    "type-ramp-plus2-font-size"
).withDefault("20px");
export const typeRampPlus2LineHeight = create<string>(
    "type-ramp-plus2-line-height"
).withDefault("28px");
export const typeRampPlus3FontSize = create<string>(
    "type-ramp-plus3-font-size"
).withDefault("28px");
export const typeRampPlus3LineHeight = create<string>(
    "type-ramp-plus3-line-height"
).withDefault("36px");
export const typeRampPlus4FontSize = create<string>(
    "type-ramp-plus4-font-size"
).withDefault("34px");
export const typeRampPlus4LineHeight = create<string>(
    "type-ramp-plus4-line-height"
).withDefault("44px");
export const typeRampPlus5FontSize = create<string>(
    "type-ramp-plus5-font-size"
).withDefault("46px");
export const typeRampPlus5LineHeight = create<string>(
    "type-ramp-plus5-line-height"
).withDefault("56px");
export const typeRampPlus6FontSize = create<string>(
    "type-ramp-plus6-font-size"
).withDefault("60px");
export const typeRampPlus6LineHeight = create<string>(
    "type-ramp-plus6-line-height"
).withDefault("72px");

export const neutralPalette = create<PaletteRGB>("neutral-palette").withDefault(
    PaletteRGB.from(middleGrey)
);
export const accentPalette = create<PaletteRGB>("accent-palette").withDefault(
    PaletteRGB.from(accentBase)
);
export const fillColor = create<SwatchRGB>("fill-color").withDefault(element => {
    const palette = neutralPalette.getValueFor(element);
    return palette.get(palette.swatches.length - 1);
});

enum ContrastTarget {
    normal = 4.5,
    large = 7,
}

const accentForegroundCutByContrast = (contrast: number) => (element: HTMLElement) =>
    accentForegroundCutAlgorithm(accentPalette.getValueFor(element).source, contrast);
export const AccentForegroundCut = DI.createInterface<
    (element: HTMLElement) => SwatchRGB
>("accent-foreground-cut", builder =>
    builder.instance((element: HTMLElement) =>
        accentForegroundCutByContrast(ContrastTarget.normal)(element)
    )
);
export const AccentForegroundCutLarge = DI.createInterface<
    (element: HTMLElement) => SwatchRGB
>("accent-foreground-cut-large", builder =>
    builder.instance((element: HTMLElement) =>
        accentForegroundCutByContrast(ContrastTarget.large)(element)
    )
);

export const accentForegroundCut = DesignToken.create<SwatchRGB>(
    "accent-foreground-cut"
).withDefault((element: HTMLElement) => {
    return DI.getOrCreateDOMContainer(element).get(AccentForegroundCut)(element);
});
export const accentForegroundCutLarge = DesignToken.create<SwatchRGB>(
    "accent-foreground-cut"
).withDefault((element: HTMLElement) => {
    return DI.getOrCreateDOMContainer(element).get(AccentForegroundCutLarge)(element);
});

const accentFillByContrast = (contrast: number) => (element: HTMLElement) => {
    return accentFillAlgorithm(
        accentPalette.getValueFor(element),
        neutralPalette.getValueFor(element),
        fillColor.getValueFor(element.parentElement || element),
        accentForegroundCut.getValueFor(element),
        contrast,
        accentFillHoverDelta.getValueFor(element),
        accentFillActiveDelta.getValueFor(element),
        accentFillFocusDelta.getValueFor(element),
        accentFillSelectedDelta.getValueFor(element),
        neutralFillRestDelta.getValueFor(element),
        neutralFillHoverDelta.getValueFor(element),
        neutralFillActiveDelta.getValueFor(element)
    );
};
export const AccentFill = DI.createInterface<
    (element: HTMLElement) => ReturnType<typeof accentFillAlgorithm>
>("accent-fill", builder =>
    builder.instance(accentFillByContrast(ContrastTarget.normal))
);

export const accentFillRest = DesignToken.create<SwatchRGB>(
    "accent-fill-rest"
).withDefault((element: HTMLElement) => {
    return DI.getOrCreateDOMContainer(element).get(AccentFill)(element).rest;
});
export const accentFillHover = DesignToken.create<SwatchRGB>(
    "accent-fill-hover"
).withDefault((element: HTMLElement) => {
    return DI.getOrCreateDOMContainer(element).get(AccentFill)(element).hover;
});
export const accentFillActive = DesignToken.create<SwatchRGB>(
    "accent-fill-active"
).withDefault((element: HTMLElement) => {
    return DI.getOrCreateDOMContainer(element).get(AccentFill)(element).active;
});
export const accentFillFocus = DesignToken.create<SwatchRGB>(
    "accent-fill-focus"
).withDefault((element: HTMLElement) => {
    return DI.getOrCreateDOMContainer(element).get(AccentFill)(element).focus;
});
export const accentFillSelected = DesignToken.create<SwatchRGB>(
    "accent-fill-selected"
).withDefault((element: HTMLElement) => {
    return DI.getOrCreateDOMContainer(element).get(AccentFill)(element).selected;
});

const accentForegroundByContrast = (contrast: number) => (element: HTMLElement) => {};
