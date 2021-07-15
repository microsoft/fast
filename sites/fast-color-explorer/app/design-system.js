import { parseColor, parseColorHexRGB } from "@microsoft/fast-colors";
import { PaletteRGB, StandardLuminance, SwatchRGB } from "@microsoft/fast-components";
import { Direction } from "@microsoft/fast-web-utilities";
import { defaultAccentColor, defaultNeutralColor } from "./colors";
export const swatchToSwatchRGB = swatch => {
    const color = parseColorHexRGB(swatch);
    return SwatchRGB.create(color.r, color.g, color.b);
};
const neutralPalette = PaletteRGB.create(
    SwatchRGB.create(0.5, 0.5, 0.5)
).swatches.map(x => x.toColorString());
const accentColor = parseColor(defaultAccentColor);
const accentPalette = PaletteRGB.create(
    SwatchRGB.create(accentColor.r, accentColor.g, accentColor.b)
).swatches.map(x => x.toColorString());
/**
 * The default values for {@link FASTDesignSystem}
 * @public
 */
export const colorDesignSystemDefaults = {
    contrast: 0,
    neutralForegroundDarkIndex: 0,
    neutralForegroundLightIndex: 0,
    baseHeightMultiplier: 8,
    baseLayerLuminance: StandardLuminance.DarkMode,
    neutralPalette,
    accentPalette,
    accentBaseColor: defaultAccentColor,
    neutralPaletteRGB: PaletteRGB.create(swatchToSwatchRGB(defaultNeutralColor)),
    accentPaletteRGB: PaletteRGB.create(swatchToSwatchRGB(defaultAccentColor)),
    typeRampMinus2FontSize: "10px",
    typeRampMinus2LineHeight: "16px",
    typeRampMinus1FontSize: "12px",
    typeRampMinus1LineHeight: "16px",
    typeRampBaseFontSize: "14px",
    typeRampBaseLineHeight: "20px",
    typeRampPlus1FontSize: "16px",
    typeRampPlus1LineHeight: "24px",
    typeRampPlus2FontSize: "20px",
    typeRampPlus2LineHeight: "28px",
    typeRampPlus3FontSize: "28px",
    typeRampPlus3LineHeight: "36px",
    typeRampPlus4FontSize: "34px",
    typeRampPlus4LineHeight: "44px",
    typeRampPlus5FontSize: "46px",
    typeRampPlus5LineHeight: "56px",
    typeRampPlus6FontSize: "60px",
    typeRampPlus6LineHeight: "72px",
    backgroundColor: "#181818",
    baseHorizontalSpacingMultiplier: 3,
    cornerRadius: 3,
    density: 0,
    designUnit: 4,
    direction: Direction.ltr,
    disabledOpacity: 0.3,
    focusStrokeWidth: 2,
    strokeWidth: 1,
    /**
     * Recipe Deltas
     */
    accentFillRestDelta: 0,
    accentFillHoverDelta: 4,
    accentFillActiveDelta: -5,
    accentFillFocusDelta: 0,
    accentForegroundRestDelta: 0,
    accentForegroundHoverDelta: 6,
    accentForegroundActiveDelta: -4,
    accentForegroundFocusDelta: 0,
    neutralFillRestDelta: 7,
    neutralFillHoverDelta: 10,
    neutralFillActiveDelta: 5,
    neutralFillFocusDelta: 0,
    neutralFillInputRestDelta: 0,
    neutralFillInputHoverDelta: 0,
    neutralFillInputActiveDelta: 0,
    neutralFillInputFocusDelta: 0,
    neutralFillStealthRestDelta: 0,
    neutralFillStealthHoverDelta: 5,
    neutralFillStealthActiveDelta: 3,
    neutralFillStealthFocusDelta: 0,
    neutralFillStrongHoverDelta: 8,
    neutralFillStrongActiveDelta: -5,
    neutralFillStrongFocusDelta: 0,
    neutralFillLayerDelta: 3,
    neutralForegroundHoverDelta: 0,
    neutralForegroundActiveDelta: 0,
    neutralForegroundFocusDelta: 0,
    neutralStrokeDividerRestDelta: 8,
    neutralStrokeRestDelta: 25,
    neutralStrokeHoverDelta: 40,
    neutralStrokeActiveDelta: 16,
    neutralStrokeFocusDelta: 25,
    neutralContrastFillRestDelta: 0,
    neutralContrastFillHoverDelta: -3,
    neutralContrastFillActiveDelta: 7,
    neutralContrastFillFocusDelta: 0,
};
/**
 * Bridge recipes between React and web component implementations.
 *
 * @param recipe
 * @returns
 */
export const bridge = recipe => {
    return d => recipe(d || colorDesignSystemDefaults);
};
export const colorsDesignSystem = Object.assign({}, colorDesignSystemDefaults, {
    // These three are only for legacy React component support
});
