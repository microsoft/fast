import { Direction } from "@microsoft/fast-web-utilities";
import { white } from "../utilities/color/color-constants";
import {
    ColorRGBA64,
    ComponentStateColorPalette,
    parseColorHexRGB,
} from "@microsoft/fast-colors";
import { Palette } from "../utilities/color/palette";
import { withDefaults } from "@microsoft/fast-jss-utilities";
import { defaultFontWeights, FontWeight } from "../utilities/fonts";
import designSystemSchema from "./design-system.schema";

export { designSystemSchema };

export type DensityOffset = -3 | -2 | -1 | 0 | 1 | 2 | 3;

export interface DesignSystem {
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
    neutralPalette: Palette;

    /**
     * An array of colors in a ramp from light to dark, used to lookup values for accent color recipes.
     * Keep this value in sync with accentBaseColor.
     * Generate by calling createColorPalette.
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
     * An object representing the supported font weights.
     */
    fontWeight?: FontWeight;

    /**
     * The corner radius applied to controls.
     */
    cornerRadius?: number;

    /**
     * The corner radius applied to elevated surfaces or controls.
     */
    elevatedCornerRadius?: number;

    /**
     * The width of the outline applied to outline components in pixels.
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
     * Color swatch deltas for the accent-fill recipe.
     */
    accentFillRestDelta: number;
    accentFillHoverDelta: number;
    accentFillActiveDelta: number;
    accentFillSelectedDelta: number;

    /**
     * Color swatch deltas for the accent-foreground recipe.
     */
    accentForegroundRestDelta: number;
    accentForegroundHoverDelta: number;
    accentForegroundActiveDelta: number;

    /*
     * Color swatch deltas for the neutral-fill recipe.
     */
    neutralFillRestDelta: number;
    neutralFillHoverDelta: number;
    neutralFillActiveDelta: number;
    neutralFillSelectedDelta: number;

    /**
     * Color swatch deltas for the neutral-fill-input recipe.
     */
    neutralFillInputRestDelta: number;
    neutralFillInputHoverDelta: number;
    neutralFillInputActiveDelta: number;
    neutralFillInputSelectedDelta: number;

    /**
     * Color swatch deltas for the neutral-fill-stealth recipe.
     */
    neutralFillStealthRestDelta: number;
    neutralFillStealthHoverDelta: number;
    neutralFillStealthActiveDelta: number;
    neutralFillStealthSelectedDelta: number;

    /**
     * Color swatch deltas for the neutral-fill-card recipe.
     */
    neutralFillCardDelta: number;

    /**
     * Color swatch deltas for the neutral-foreground recipe.
     */
    /**
     * @deprecated Neutral foreground is now based on contrast and this is no longer used.
     */
    neutralForegroundDarkIndex: number;
    /**
     * @deprecated Neutral foreground is now based on contrast and this is no longer used.
     */
    neutralForegroundLightIndex: number;

    neutralForegroundHoverDelta: number;
    neutralForegroundActiveDelta: number;

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
}

export function createColorPalette(baseColor: ColorRGBA64): Palette {
    return new ComponentStateColorPalette({
        baseColor,
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
    elevatedCornerRadius: 4,
    focusOutlineWidth: 2,
    fontWeight: defaultFontWeights,
    disabledOpacity: 0.3,
    outlineWidth: 1,
    neutralPalette: createColorPalette(parseColorHexRGB("#808080")),
    accentPalette: createColorPalette(parseColorHexRGB("#0078D4")),
    accentBaseColor: "#0078D4",

    /**
     * Recipe Deltas
     */
    accentFillRestDelta: 0,
    accentFillHoverDelta: 4,
    accentFillActiveDelta: -5,
    accentFillSelectedDelta: 12,

    accentForegroundRestDelta: 0,
    accentForegroundHoverDelta: 6,
    accentForegroundActiveDelta: -4,

    neutralFillRestDelta: 7,
    neutralFillHoverDelta: 10,
    neutralFillActiveDelta: 5,
    neutralFillSelectedDelta: 7,

    neutralFillInputRestDelta: 0,
    neutralFillInputHoverDelta: 0,
    neutralFillInputActiveDelta: 0,
    neutralFillInputSelectedDelta: 0,

    neutralFillStealthRestDelta: 0,
    neutralFillStealthHoverDelta: 5,
    neutralFillStealthActiveDelta: 3,
    neutralFillStealthSelectedDelta: 7,

    neutralFillCardDelta: 3,

    neutralForegroundDarkIndex: 93,
    neutralForegroundLightIndex: 0,

    neutralForegroundHoverDelta: 0,
    neutralForegroundActiveDelta: 0,

    neutralDividerRestDelta: 6,

    neutralOutlineRestDelta: 25,
    neutralOutlineHoverDelta: 40,
    neutralOutlineActiveDelta: 16,
};

/**
 * Ensure that all properties of the DesignSystem are assigned.
 */
export const withDesignSystemDefaults: (config: Partial<DesignSystem>) => DesignSystem = (
    config: Partial<DesignSystem>
): DesignSystem => withDefaults(designSystemDefaults)(config);

/**
 * Safely retrieves a single property from a DesignSystem.
 * @deprecated Use getDesignSystemValue instead.
 */
export function getDesignSystemProperty(key: string): DesignSystemResolver<string> {
    return function(config: DesignSystem): string {
        return withDesignSystemDefaults(config)[key];
    };
}

/**
 * Safely retrieves the value from a key of the DesignSystem.
 */
export function getDesignSystemValue<T extends DesignSystem, K extends keyof T>(
    key: K
): (designSystem?: T) => T[K] {
    return (designSystem?: T): T[K] => {
        return designSystem && designSystem[key] !== undefined
            ? designSystem[key]
            : (designSystemDefaults as T)[key];
    };
}

/**
 * Returns the argument if basic, otherwise calls the DesignSystemResolver function.
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
 * @deprecated - use design system property accesseor functions instead
 */
export function ensureDesignSystemDefaults<T>(
    callback: (designSystem: DesignSystem) => T
): (designSystem: DesignSystem) => T {
    return (designSystem: DesignSystem): T => {
        return callback(withDesignSystemDefaults(designSystem));
    };
}

/**
 * A function that accepts a DesignSystem and returns a generic type.
 */
export type DesignSystemResolver<T> = (designSystem: DesignSystem) => T;

export default designSystemDefaults;
