import { DesignToken } from "@microsoft/fast-foundation";
import { Direction } from "@microsoft/fast-web-utilities";
import { FASTDesignSystem } from "./fast-design-system";

const { create } = DesignToken;
const t = document.body as HTMLBodyElement;

export const accentBaseColor = create<string>("accent-base-color");
export const accentFillActiveDelta = create<number>("accent-fill-active-delta");
export const accentFillFocusDelta = create<number>("accent-fill-focus-delta");
export const accentFillHoverDelta = create<number>("accent-fill-hover-delta");
export const accentFillRestDelta = create<number>("accent-fill-rest-delta");
export const accentFillSelectedDelta = create<number>("accent-fill-selected-delta");
export const accentForegroundActiveDelta = create<number>(
    "accent-foreground-active-delta"
);
export const accentForegroundFocusDelta = create<number>("accent-foreground-focus-delta");
export const accentForegroundHoverDelta = create<number>("accent-foreground-hover-delta");
export const accentForegroundRestDelta = create<number>("accent-foreground-rest-delta");
export const accentPalette = create<string[]>("accent-palette");
export const backgroundColor = create<string>("background-color");
export const bodyFont = create<string>("body-font");
export const baseHeightMultiplier = create<number>("base-height-multiplier");
export const baseHorizontalSpacingMultiplier = create<number>(
    "base-horizontal-spacing-multiplier"
);
export const baseLayerLuminance = create<number>("base-layer-luminance");
export const cornerRadius = create<number>("corner-radius");
export const density = create<number>("density");
export const designUnit = create<number>("design-unit");
export const direction = create<Direction>("direction");
export const disabledOpacity = create<number>("disabled-opacity");
export const focusOutlineWidth = create<number>("focus-outline-width");
export const neutralContrastFillActiveDelta = create<number>(
    "neutral-contrast-fill-active-delta"
);
export const neutralContrastFillFocusDelta = create<number>(
    "neutral-contrast-fill-focus-delta"
);
export const neutralContrastFillHoverDelta = create<number>(
    "neutral-contrast-fill-hover-delta"
);
export const neutralContrastFillRestDelta = create<number>(
    "neutral-contrast-fill-rest-delta"
);
export const neutralDividerRestDelta = create<number>("neutral-divider-rest-delta");
export const neutralFillActiveDelta = create<number>("neutral-fill-active-delta");
export const neutralFillCardDelta = create<number>("neutral-fill-card-delta");
export const neutralFillFocusDelta = create<number>("neutral-fill-focus-delta");
export const neutralFillHoverDelta = create<number>("neutral-fill-hover-delta");
export const neutralFillInputActiveDelta = create<number>(
    "neutral-fill-input-active-delta"
);
export const neutralFillInputFocusDelta = create<number>(
    "neutral-fill-input-focus-delta"
);
export const neutralFillInputHoverDelta = create<number>(
    "neutral-fill-input-hover-delta"
);
export const neutralFillInputRestDelta = create<number>("neutral-fill-input-rest-delta");
export const neutralFillInputSelectedDelta = create<number>(
    "neutral-fill-input-selected-delta"
);
export const neutralFillRestDelta = create<number>("neutral-fill-rest-delta");
export const neutralFillSelectedDelta = create<number>("neutral-fill-selected-delta");
export const neutralFillStealthActiveDelta = create<number>(
    "neutral-fill-stealth-active-delta"
);
export const neutralFillStealthFocusDelta = create<number>(
    "neutral-fill-stealth-focus-delta"
);
export const neutralFillStealthHoverDelta = create<number>(
    "neutral-fill-stealth-hover-delta"
);
export const neutralFillStealthRestDelta = create<number>(
    "neutral-fill-stealth-rest-delta"
);
export const neutralFillStealthSelectedDelta = create<number>(
    "neutral-fill-stealth-selected-delta"
);
export const neutralFillToggleActiveDelta = create<number>(
    "neutral-fill-toggle-active-delta"
);
export const neutralFillToggleFocusDelta = create<number>(
    "neutral-fill-toggle-focus-delta"
);
export const neutralFillToggleHoverDelta = create<number>(
    "neutral-fill-toggle-hover-delta"
);
export const neutralForegroundActiveDelta = create<number>(
    "neutral-foreground-active-delta"
);
export const neutralForegroundFocusDelta = create<number>(
    "neutral-foreground-focus-delta"
);
export const neutralForegroundHoverDelta = create<number>(
    "neutral-foreground-hover-delta"
);
export const neutralOutlineActiveDelta = create<number>("neutral-outline-active-delta");
export const neutralOutlineFocusDelta = create<number>("neutral-outline-focus-delta");
export const neutralOutlineHoverDelta = create<number>("neutral-outline-hover-delta");
export const neutralOutlineRestDelta = create<number>("neutral-outline-rest-delta");
// export const neutralPalette = create<string[]>("neutralPalette");
export const outlineWidth = create<number>("outline-width");
export const typeRampBaseFontSize = create<string>("type-ramp-base-font-size");
export const typeRampBaseLineHeight = create<string>("type-ramp-base-line-height");
export const typeRampMinus1FontSize = create<string>("type-ramp-minus1-font-size");
export const typeRampMinus1LineHeight = create<string>("type-ramp-minus1-line-height");
export const typeRampMinus2FontSize = create<string>("type-ramp-minus2-font-size");
export const typeRampMinus2LineHeight = create<string>("type-ramp-minus2-line-height");
export const typeRampPlus1FontSize = create<string>("type-ramp-plus1-font-size");
export const typeRampPlus1LineHeight = create<string>("type-ramp-plus1-line-height");
export const typeRampPlus2FontSize = create<string>("type-ramp-plus2-font-size");
export const typeRampPlus2LineHeight = create<string>("type-ramp-plus2-line-height");
export const typeRampPlus3FontSize = create<string>("type-ramp-plus3-font-size");
export const typeRampPlus3LineHeight = create<string>("type-ramp-plus3-line-height");
export const typeRampPlus4FontSize = create<string>("type-ramp-plus4-font-size");
export const typeRampPlus4LineHeight = create<string>("type-ramp-plus4-line-height");
export const typeRampPlus5FontSize = create<string>("type-ramp-plus5-font-size");
export const typeRampPlus5LineHeight = create<string>("type-ramp-plus5-line-height");
export const typeRampPlus6FontSize = create<string>("type-ramp-plus6-font-size");
export const typeRampPlus6LineHeight = create<string>("type-ramp-plus6-line-height");

// accentBaseColor.setValueFor(t, "#DA1A5F");
accentFillActiveDelta.setValueFor(t, -5);
accentFillFocusDelta.setValueFor(t, 0);
accentFillHoverDelta.setValueFor(t, 4);
accentFillRestDelta.setValueFor(t, 0);
accentFillSelectedDelta.setValueFor(t, 12);
accentForegroundActiveDelta.setValueFor(t, -4);
accentForegroundFocusDelta.setValueFor(t, 0);
accentForegroundHoverDelta.setValueFor(t, 6);
accentForegroundRestDelta.setValueFor(t, 0);
// accentPalette.setValueFor(t, defaultAccentPalette);
backgroundColor.setValueFor(t, "#181818");
baseHeightMultiplier.setValueFor(t, 10);
baseHorizontalSpacingMultiplier.setValueFor(t, 3);
baseLayerLuminance.setValueFor(t, -1);
bodyFont.setValueFor(t, "Segoe UI");
cornerRadius.setValueFor(t, 3);
density.setValueFor(t, 0);
designUnit.setValueFor(t, 4);
direction.setValueFor(t, Direction.ltr);
disabledOpacity.setValueFor(t, 0.3);
focusOutlineWidth.setValueFor(t, 2);
neutralContrastFillActiveDelta.setValueFor(t, 7);
neutralContrastFillFocusDelta.setValueFor(t, 0);
neutralContrastFillHoverDelta.setValueFor(t, -3);
neutralContrastFillRestDelta.setValueFor(t, 0);
neutralDividerRestDelta.setValueFor(t, 8);
neutralFillActiveDelta.setValueFor(t, 5);
neutralFillCardDelta.setValueFor(t, 3);
neutralFillFocusDelta.setValueFor(t, 0);
neutralFillHoverDelta.setValueFor(t, 10);
neutralFillInputActiveDelta.setValueFor(t, 0);
neutralFillInputFocusDelta.setValueFor(t, 0);
neutralFillInputHoverDelta.setValueFor(t, 0);
neutralFillInputRestDelta.setValueFor(t, 0);
neutralFillInputSelectedDelta.setValueFor(t, 0);
neutralFillRestDelta.setValueFor(t, 7);
neutralFillSelectedDelta.setValueFor(t, 7);
neutralFillStealthActiveDelta.setValueFor(t, 3);
neutralFillStealthFocusDelta.setValueFor(t, 0);
neutralFillStealthHoverDelta.setValueFor(t, 5);
neutralFillStealthRestDelta.setValueFor(t, 0);
neutralFillStealthSelectedDelta.setValueFor(t, 7);
neutralFillToggleActiveDelta.setValueFor(t, -5);
neutralFillToggleFocusDelta.setValueFor(t, 0);
neutralFillToggleHoverDelta.setValueFor(t, 8);
neutralForegroundActiveDelta.setValueFor(t, 0);
neutralForegroundFocusDelta.setValueFor(t, 0);
neutralForegroundHoverDelta.setValueFor(t, 0);
neutralOutlineActiveDelta.setValueFor(t, 16);
neutralOutlineFocusDelta.setValueFor(t, 25);
neutralOutlineHoverDelta.setValueFor(t, 40);
neutralOutlineRestDelta.setValueFor(t, 25);
// neutralPalette.setValueFor(t, defaultNeutralPalette);
outlineWidth.setValueFor(t, 1);
typeRampBaseFontSize.setValueFor(t, "14px");
typeRampBaseLineHeight.setValueFor(t, "20px");
typeRampMinus1FontSize.setValueFor(t, "12px");
typeRampMinus1LineHeight.setValueFor(t, "16px");
typeRampMinus2FontSize.setValueFor(t, "10px");
typeRampMinus2LineHeight.setValueFor(t, "16px");
typeRampPlus1FontSize.setValueFor(t, "16px");
typeRampPlus1LineHeight.setValueFor(t, "24px");
typeRampPlus2FontSize.setValueFor(t, "20px");
typeRampPlus2LineHeight.setValueFor(t, "28px");
typeRampPlus3FontSize.setValueFor(t, "28px");
typeRampPlus3LineHeight.setValueFor(t, "36px");
typeRampPlus4FontSize.setValueFor(t, "34px");
typeRampPlus4LineHeight.setValueFor(t, "44px");
typeRampPlus5FontSize.setValueFor(t, "46px");
typeRampPlus5LineHeight.setValueFor(t, "56px");
typeRampPlus6FontSize.setValueFor(t, "60px");
typeRampPlus6LineHeight.setValueFor(t, "72px");
