import { Direction } from "@microsoft/fast-web-utilities";
import { withDefaults } from "@microsoft/fast-jss-utilities";
import {
    accentPaletteConfig,
    neutralPaletteConfig,
    white,
} from "../utilities/color/color-constants";
import {
    ColorPalette,
    ColorPaletteConfig,
    ColorRGBA64,
    parseColorHexRGB,
} from "@microsoft/fast-colors";
import { Palette } from "../utilities/color/palette";

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
     * The brand color used as color accents.
     * @deprecated
     */
    brandColor: string;

    /**
     * A number between 0 and 100 that represents the contrast scale value.
     */
    contrast: number;

    /**
     * The density multiplier
     */
    density: number;

    /**
     * The grid-unit that UI dimensions are derived from
     */
    designUnit: number;

    /**
     * The primary direction of the view.
     */
    direction: Direction;

    /**
     * The value typically used for foreground elements, such as text
     * @deprecated
     */
    foregroundColor: string;

    /**
     * The corner default radius applied to controls
     */
    cornerRadius?: number;

    /*
     * The width of the outline in pixels applied to outline components
     */
    outlinePatternOutlineWidth?: number;

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

function createColorPalette(baseColor: ColorRGBA64): Palette {
    return new ColorPalette({
        baseColor,
        clipDark: 0,
        clipLight: 0,
        overlayDark: 0,
        overlayLight: 0,
        saturationDark: 0,
        saturationLight: 0,
        steps: 63,
    }).palette.map((color: ColorRGBA64) => color.toStringHexRGB());
}

const designSystemDefaults: DesignSystem = {
    backgroundColor: white,
    contrast: 0,
    density: 1,
    designUnit: 4,
    direction: Direction.ltr,
    cornerRadius: 2,
    outlinePatternOutlineWidth: 1,
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
    accentForegroundHoverDelta: 1,
    accentForegroundActiveDelta: 2,

    neutralFillRestDelta: 4,
    neutralFillHoverDelta: 3,
    neutralFillActiveDelta: 2,
    neutralFillSelectedDelta: 16,

    neutralFillInputRestDelta: 4,
    neutralFillInputHoverDelta: 4,
    neutralFillInputActiveDelta: 4,
    neutralFillInputSelectedDelta: 4,

    neutralFillStealthRestDelta: 0,
    neutralFillStealthHoverDelta: 3,
    neutralFillStealthActiveDelta: 2,
    neutralFillStealthSelectedDelta: 12,

    neutralForegroundDarkIndex: 58,
    neutralForegroundLightIndex: 0,
    neutralForegroundHoverDelta: 8,
    neutralForegroundActiveDelta: 16,

    neutralOutlineRestDelta: 12,
    neutralOutlineHoverDelta: 24,
    neutralOutlineActiveDelta: 18,

    // @deprecated
    foregroundColor: "#111",
    brandColor: "#0078D4",
};

/**
 * Ensure that all properties of the design system are assigned
 */
export const withDesignSystemDefaults: (config: Partial<DesignSystem>) => DesignSystem = (
    config: Partial<DesignSystem>
): DesignSystem => withDefaults(designSystemDefaults)(config);

/**
 * Safely retrieves a single property from a design system
 */
export function getDesignSystemProperty(key: string): DesignSystemResolver<string> {
    return function(config: DesignSystem): string {
        return withDesignSystemDefaults(config)[key];
    };
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
