import { PaletteRGB, SwatchRGB } from "@microsoft/fast-components";
import { DesignSystemResolver } from "@microsoft/fast-components-styles-msft";
import { Direction } from "@microsoft/fast-web-utilities";
export declare const swatchToSwatchRGB: (swatch: string) => SwatchRGB;
export interface ColorsDesignSystem {
    contrast: number;
    neutralForegroundDarkIndex: number;
    neutralForegroundLightIndex: number;
    neutralPaletteRGB: PaletteRGB;
    accentPaletteRGB: PaletteRGB;
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
     * The width of the standard stroke applied to outline components in pixels.
     */
    strokeWidth: number;
    /**
     * The width of the standard focus stroke in pixels.
     */
    focusStrokeWidth: number;
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
    /**
     * Color swatch deltas for the accent-foreground recipe.
     */
    accentForegroundRestDelta: number;
    accentForegroundHoverDelta: number;
    accentForegroundActiveDelta: number;
    accentForegroundFocusDelta: number;
    neutralFillRestDelta: number;
    neutralFillHoverDelta: number;
    neutralFillActiveDelta: number;
    neutralFillFocusDelta: number;
    /**
     * Color swatch deltas for the neutral-fill-input recipe.
     */
    neutralFillInputRestDelta: number;
    neutralFillInputHoverDelta: number;
    neutralFillInputActiveDelta: number;
    neutralFillInputFocusDelta: number;
    /**
     * Color swatch deltas for the neutral-fill-stealth recipe.
     */
    neutralFillStealthRestDelta: number;
    neutralFillStealthHoverDelta: number;
    neutralFillStealthActiveDelta: number;
    neutralFillStealthFocusDelta: number;
    /**
     * Configuration for the neutral-fill-strong recipe.
     */
    neutralFillStrongHoverDelta: number;
    neutralFillStrongActiveDelta: number;
    neutralFillStrongFocusDelta: number;
    /**
     * The luminance value to base layer recipes on.
     * Sets the luminance value for the L1 layer recipe in a manner that can adjust to variable contrast.
     *
     * Currently defaults to -1 to turn the feature off and use backgroundColor for layer colors instead.
     */
    baseLayerLuminance: number;
    /**
     * Color swatch deltas for the neutral-fill-layer recipe.
     */
    neutralFillLayerDelta: number;
    /**
     * Color swatch delta for neutral-foreground recipe.
     */
    neutralForegroundHoverDelta: number;
    neutralForegroundActiveDelta: number;
    neutralForegroundFocusDelta: number;
    /**
     * Color swatch delta for the neutral-stroke-divider recipe.
     */
    neutralStrokeDividerRestDelta: number;
    /**
     * Color swatch deltas for the neutral-stroke recipe.
     */
    neutralStrokeRestDelta: number;
    neutralStrokeHoverDelta: number;
    neutralStrokeActiveDelta: number;
    neutralStrokeFocusDelta: number;
    neutralContrastFillRestDelta: number;
    neutralContrastFillHoverDelta: number;
    neutralContrastFillActiveDelta: number;
    neutralContrastFillFocusDelta: number;
}
/**
 * The default values for {@link FASTDesignSystem}
 * @public
 */
export declare const colorDesignSystemDefaults: ColorsDesignSystem;
/**
 * Bridge recipes between React and web component implementations.
 *
 * @param recipe
 * @returns
 */
export declare const bridge: (recipe: DesignSystemResolver<string>) => any;
export declare const colorsDesignSystem: ColorsDesignSystem;
