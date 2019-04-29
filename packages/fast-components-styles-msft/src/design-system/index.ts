import { Direction } from "@microsoft/fast-web-utilities";
import { white } from "../utilities/color/color-constants";
import { ColorPalette, ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { Palette } from "../utilities/color/palette";
import { withDefaults } from "@microsoft/fast-jss-utilities";
import { defaultFontWeights, FontWeight } from "../utilities/fonts";

export type DensityOffset = -3 | -2 | -1 | 0 | 1 | 2 | 3;

export interface DesignSystem {
    /**
     * The value typically used for backgrounds of elements
     */
    backgroundColor: string;

    /**
     * Configuration object to derive the neutral palette. Expects a ColorPaletteConfig from @microsoft/fast-colors
     */
    neutralPalette: Palette;

    /**
     * Configuration object to derive the accent palette. Expects a ColorPaletteConfig from @microsoft/fast-colors
     */
    accentPalette: Palette;

    /**
     * A number between 0 and 100 that represents the contrast scale value.
     */
    contrast: number;

    /**
     * The density offset, used with designUnit to calculate height and spacing.
     */
    density: DensityOffset;

    /**
     * The grid-unit that UI dimensions are derived from in pixels.
     */
    designUnit: number;

    /**
     * The number of designUnits used for component height at the base density.
     */
    baseHeightMultiplier: number;

    /**
     * The number of designUnits used for horizontal spacing at the base density.
     */
    baseHorizontalSpacingMultiplier: number;

    /**
     * The primary direction of the view.
     */
    direction: Direction;

    /**
     * An object representing the supported font weights
     */
    fontWeight?: FontWeight;

    /**
     * The corner default radius applied to controls.
     */
    cornerRadius?: number;

    /**
     * The width of the outline in pixels applied to outline components.
     */
    outlineWidth?: number;

    /**
     * The width of the outline for focus state in pixels.
     */
    focusOutlineWidth: number;

    /**
     * The opacity to use for disabled component state.
     */
    disabledOpacity: number;

    /**
     * Color swatch deltas for accent-fill recipe
     */
    accentFillRestDelta: number;
    accentFillHoverDelta: number;
    accentFillActiveDelta: number;
    accentFillSelectedDelta: number;

    /**
     * Color swatch deltas for accent-foreground recipe
     */
    accentForegroundRestDelta: number;
    accentForegroundHoverDelta: number;
    accentForegroundActiveDelta: number;

    /*
     * Color swatch deltas for neutral-fill recipe
     */
    neutralFillRestDelta: number;
    neutralFillHoverDelta: number;
    neutralFillActiveDelta: number;
    neutralFillSelectedDelta: number;

    /**
     * Color swatch deltas for neutral-fill-input recipe
     */
    neutralFillInputRestDelta: number;
    neutralFillInputHoverDelta: number;
    neutralFillInputActiveDelta: number;
    neutralFillInputSelectedDelta: number;

    /**
     * Color swatch deltas for neutral-fill-stealth recipe
     */
    neutralFillStealthRestDelta: number;
    neutralFillStealthHoverDelta: number;
    neutralFillStealthActiveDelta: number;
    neutralFillStealthSelectedDelta: number;

    /**
     * Color swatch deltas for neutral-fill-card recipe
     */
    neutralFillCardDelta: number;

    /**
     * Color swatch deltas for neutral-foreground
     */
    neutralForegroundDarkIndex: number;
    neutralForegroundLightIndex: number;
    neutralForegroundHoverDelta: number;
    neutralForegroundActiveDelta: number;

    /**
     * Color swatch deltas for neutral-outline
     */
    neutralOutlineRestDelta: number;
    neutralOutlineHoverDelta: number;
    neutralOutlineActiveDelta: number;
}

export function createColorPalette(baseColor: ColorRGBA64): Palette {
    return new ColorPalette({
        baseColor,
        clipDark: 0,
        clipLight: 0,
        overlayDark: 0,
        overlayLight: 0,
        saturationDark: 0,
        saturationLight: 0,
        steps: 63,
    }).palette.map((color: ColorRGBA64) => color.toStringHexRGB().toUpperCase());
}

const designSystemDefaults: DesignSystem = {
    backgroundColor: white,
    contrast: 0,
    density: 0,
    designUnit: 4,
    baseHeightMultiplier: 8,
    baseHorizontalSpacingMultiplier: 3,
    direction: Direction.ltr,
    cornerRadius: 2,
    focusOutlineWidth: 2,
    fontWeight: defaultFontWeights,
    disabledOpacity: 0.3,
    outlineWidth: 1,
    neutralPalette: createColorPalette(new ColorRGBA64(0.5, 0.5, 0.5, 1)),
    accentPalette: createColorPalette(parseColorHexRGB("#0078D4")),

    /**
     * Recipe Deltas
     */
    accentFillRestDelta: 0,
    accentFillHoverDelta: 2,
    accentFillActiveDelta: 4,
    accentFillSelectedDelta: 12,

    accentForegroundRestDelta: 0,
    accentForegroundHoverDelta: 4,
    accentForegroundActiveDelta: 8,

    neutralFillRestDelta: 4,
    neutralFillHoverDelta: 3,
    neutralFillActiveDelta: 2,
    neutralFillSelectedDelta: 8,

    neutralFillInputRestDelta: 4,
    neutralFillInputHoverDelta: 4,
    neutralFillInputActiveDelta: 4,
    neutralFillInputSelectedDelta: 4,

    neutralFillStealthRestDelta: 0,
    neutralFillStealthHoverDelta: 3,
    neutralFillStealthActiveDelta: 2,
    neutralFillStealthSelectedDelta: 8,

    neutralFillCardDelta: 2,

    neutralForegroundDarkIndex: 58,
    neutralForegroundLightIndex: 0,

    neutralForegroundHoverDelta: 8,
    neutralForegroundActiveDelta: 16,

    neutralOutlineRestDelta: 12,
    neutralOutlineHoverDelta: 24,
    neutralOutlineActiveDelta: 18,
};

/**
 * Ensure that all properties of the design system are assigned
 */
export const withDesignSystemDefaults: (config: Partial<DesignSystem>) => DesignSystem = (
    config: Partial<DesignSystem>
): DesignSystem => withDefaults(designSystemDefaults)(config);

/**
 * Safely retrieves a single property from a design system
 * @deprecated Use getDesignSystemValue instead.
 */
export function getDesignSystemProperty(key: string): DesignSystemResolver<string> {
    return function(config: DesignSystem): string {
        return withDesignSystemDefaults(config)[key];
    };
}

/**
 * Safely retrieves the value from a key of the designSystem.
 */
export function getDesignSystemValue<T extends DesignSystem, K extends keyof T>(
    key: K
): (designSystem?: T) => T[K] {
    return (designSystem?: T): T[K] =>
        (designSystem && designSystem[key]) || (designSystemDefaults as T)[key];
}

/**
 * Returns the argument if basic, othwerwise calls the DesignSystemResolver function.
 *
 * @param arg A value or a DesignSystemResolver function
 * @param designSystem The design system config.
 */
export function checkDesignSystemResolver<T>(
    arg: T | DesignSystemResolver<T>,
    designSystem: DesignSystem
): T {
    const value: T =
        typeof arg === "function" ? (arg as DesignSystemResolver<T>)(designSystem) : arg;
    return value;
}

/**
 * Returns a function that calls the callback with designSystemDefaults ensured.
 */
export function ensureDesignSystemDefaults<T>(
    callback: (designSystem: DesignSystem) => T
): (designSystem: DesignSystem) => T {
    return (designSystem: DesignSystem): T => {
        return callback(withDesignSystemDefaults(designSystem));
    };
}

/**
 * A function that accepts a design system and returns a generic type
 */
export type DesignSystemResolver<T> = (designSystem: DesignSystem) => T;

export default designSystemDefaults;
