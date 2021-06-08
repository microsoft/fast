import { ColorRGBA64, parseColor, parseColorHexRGB } from "@microsoft/fast-colors";
import { PaletteRGB, StandardLuminance, SwatchRGB } from "@microsoft/fast-components";
import { Direction } from "@microsoft/fast-web-utilities";
import { defaultAccentColor, defaultNeutralColor } from "./colors";

export interface FASTDesignSystem {
    /**
     * Type-ramp font-size and line-height values
     */
    typeRampMinus2FontSize: string;
    typeRampMinus2LineHeight: string;
    typeRampMinus1FontSize: string;
    typeRampMinus1LineHeight: string;
    typeRampBaseFontSize: string;
    typeRampBaseLineHeight: string;
    typeRampPlus1FontSize: string;
    typeRampPlus1LineHeight: string;
    typeRampPlus2FontSize: string;
    typeRampPlus2LineHeight: string;
    typeRampPlus3FontSize: string;
    typeRampPlus3LineHeight: string;
    typeRampPlus4FontSize: string;
    typeRampPlus4LineHeight: string;
    typeRampPlus5FontSize: string;
    typeRampPlus5LineHeight: string;
    typeRampPlus6FontSize: string;
    typeRampPlus6LineHeight: string;

    /**
     * The background color of the current context.
     * May be used to draw an actual background or not. Color recipes evaluated within this context will use this as their basis.
     */
    backgroundColor: string;

    /**
     * The accent color, which the accent palette is based on.
     * Keep this value in sync with accentPalette.
     */
    accentBaseColor: string;

    /**
     * An array of colors in a ramp from light to dark, used to look up values for neutral color recipes.
     * Generate by calling createColorPalette.
     */
    neutralPalette: string[];

    /**
     * An array of colors in a ramp from light to dark, used to lookup values for accent color recipes.
     * Keep this value in sync with accentBaseColor.
     * Generate by calling createColorPalette.
     */
    accentPalette: string[];

    /**
     * The density offset, used with designUnit to calculate height and spacing.
     */
    density: number;

    /**
     * The grid-unit that UI dimensions are derived from in pixels.
     */
    designUnit: number;

    /**
     * The primary document direction.
     */
    direction: Direction;

    /**
     * The number of designUnits used for component height at the base density.
     */
    baseHeightMultiplier: number;

    /**
     * The number of designUnits used for horizontal spacing at the base density.
     */
    baseHorizontalSpacingMultiplier: number;

    /**
     * The corner radius applied to controls.
     */
    cornerRadius: number;

    /**
     * The width of the standard outline applied to outline components in pixels.
     */
    outlineWidth: number;

    /**
     * The width of the standard focus outline in pixels.
     */
    focusOutlineWidth: number;

    /**
     * The opacity of a disabled control.
     */
    disabledOpacity: number;

    /**
     * Color swatch deltas for the accent-fill recipe.
     */
    accentFillRestDelta: number;
    accentFillHoverDelta: number;
    accentFillActiveDelta: number;
    accentFillFocusDelta: number;
    accentFillSelectedDelta: number;

    /**
     * Color swatch deltas for the accent-foreground recipe.
     */
    accentForegroundRestDelta: number;
    accentForegroundHoverDelta: number;
    accentForegroundActiveDelta: number;
    accentForegroundFocusDelta: number;

    /*
     * Color swatch deltas for the neutral-fill recipe.
     */
    neutralFillRestDelta: number;
    neutralFillHoverDelta: number;
    neutralFillActiveDelta: number;
    neutralFillFocusDelta: number;
    neutralFillSelectedDelta: number;

    /**
     * Color swatch deltas for the neutral-fill-input recipe.
     */
    neutralFillInputRestDelta: number;
    neutralFillInputHoverDelta: number;
    neutralFillInputActiveDelta: number;
    neutralFillInputFocusDelta: number;
    neutralFillInputSelectedDelta: number;

    /**
     * Color swatch deltas for the neutral-fill-stealth recipe.
     */
    neutralFillStealthRestDelta: number;
    neutralFillStealthHoverDelta: number;
    neutralFillStealthActiveDelta: number;
    neutralFillStealthFocusDelta: number;
    neutralFillStealthSelectedDelta: number;

    /**
     * Configuration for the neutral-fill-toggle recipe.
     */
    neutralFillToggleHoverDelta: number;
    neutralFillToggleActiveDelta: number;
    neutralFillToggleFocusDelta: number;

    /**
     * The luminance value to base layer recipes on.
     * Sets the luminance value for the L1 layer recipe in a manner that can adjust to variable contrast.
     *
     * Currently defaults to -1 to turn the feature off and use backgroundColor for layer colors instead.
     */
    baseLayerLuminance: number; // 0...1

    /**
     * Color swatch deltas for the neutral-fill-card recipe.
     */
    neutralFillCardDelta: number;

    /**
     * Color swatch delta for neutral-foreground recipe.
     */
    neutralForegroundHoverDelta: number;
    neutralForegroundActiveDelta: number;
    neutralForegroundFocusDelta: number;

    /**
     * Color swatch delta for the neutral-divider recipe.
     */
    neutralDividerRestDelta: number;

    /**
     * Color swatch deltas for the neutral-outline recipe.
     */
    neutralOutlineRestDelta: number;
    neutralOutlineHoverDelta: number;
    neutralOutlineActiveDelta: number;
    neutralOutlineFocusDelta: number;

    /*
     * Color swatch deltas for the neutral-contrast-fill recipe.
     */
    neutralContrastFillRestDelta: number;
    neutralContrastFillHoverDelta: number;
    neutralContrastFillActiveDelta: number;
    neutralContrastFillFocusDelta: number;
}

const neutralPalette = PaletteRGB.create(
    SwatchRGB.create(0.5, 0.5, 0.5)
).swatches.map((x: SwatchRGB) => x.toColorString());
const accentColor = parseColor(defaultAccentColor)!;
const accentPalette = PaletteRGB.create(
    SwatchRGB.create(accentColor.r, accentColor.g, accentColor.b)
).swatches.map((x: SwatchRGB) => x.toColorString());

/**
 * The default values for {@link FASTDesignSystem}
 * @public
 * @deprecated - Use DesignTokens
 */
export const fastDesignSystemDefaults: FASTDesignSystem = {
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

    accentBaseColor: "#DA1A5F",
    accentPalette: accentPalette,
    backgroundColor: "#181818",
    baseHeightMultiplier: 10,
    baseHorizontalSpacingMultiplier: 3,
    cornerRadius: 3,
    density: 0,
    designUnit: 4,
    direction: Direction.ltr,
    disabledOpacity: 0.3,
    focusOutlineWidth: 2,
    neutralPalette: neutralPalette,
    outlineWidth: 1,

    /**
     * Recipe Deltas
     */
    accentFillRestDelta: 0,
    accentFillHoverDelta: 4,
    accentFillActiveDelta: -5,
    accentFillFocusDelta: 0,
    accentFillSelectedDelta: 12,

    accentForegroundRestDelta: 0,
    accentForegroundHoverDelta: 6,
    accentForegroundActiveDelta: -4,
    accentForegroundFocusDelta: 0,

    neutralFillRestDelta: 7,
    neutralFillHoverDelta: 10,
    neutralFillActiveDelta: 5,
    neutralFillFocusDelta: 0,
    neutralFillSelectedDelta: 7,

    neutralFillInputRestDelta: 0,
    neutralFillInputHoverDelta: 0,
    neutralFillInputActiveDelta: 0,
    neutralFillInputFocusDelta: 0,
    neutralFillInputSelectedDelta: 0,

    neutralFillStealthRestDelta: 0,
    neutralFillStealthHoverDelta: 5,
    neutralFillStealthActiveDelta: 3,
    neutralFillStealthFocusDelta: 0,
    neutralFillStealthSelectedDelta: 7,

    neutralFillToggleHoverDelta: 8,
    neutralFillToggleActiveDelta: -5,
    neutralFillToggleFocusDelta: 0,

    baseLayerLuminance: -1,
    neutralFillCardDelta: 3,

    neutralForegroundHoverDelta: 0,
    neutralForegroundActiveDelta: 0,
    neutralForegroundFocusDelta: 0,

    neutralDividerRestDelta: 8,

    neutralOutlineRestDelta: 25,
    neutralOutlineHoverDelta: 40,
    neutralOutlineActiveDelta: 16,
    neutralOutlineFocusDelta: 25,

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
export const bridge = (recipe: any): any => {
    return (d?: FASTDesignSystem): any => recipe(d || fastDesignSystemDefaults);
};

export type ColorsDesignSystem = FASTDesignSystem & {
    // Bring these back from the old DesignSystem for use with React components
    contrast: number;
    neutralForegroundDarkIndex: number;
    neutralForegroundLightIndex: number;

    neutralPaletteRGB: PaletteRGB;
    accentPaletteRGB: PaletteRGB;
};

export const swatchToSwatchRGB = (swatch: string): SwatchRGB => {
    const color = parseColorHexRGB(swatch) as ColorRGBA64;
    return SwatchRGB.create(color.r, color.g, color.b);
};

export const colorsDesignSystem: ColorsDesignSystem = Object.assign(
    {},
    fastDesignSystemDefaults,
    {
        // These three are only for legacy React component support
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
    }
);
