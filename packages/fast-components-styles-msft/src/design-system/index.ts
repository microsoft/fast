import { Direction } from "@microsoft/fast-web-utilities";
import { withDefaults } from "@microsoft/fast-jss-utilities";
import {
    accentPaletteConfig,
    neutralPaletteConfig,
    white,
} from "../utilities/color/color-constants";
import { ColorPaletteConfig } from "@microsoft/fast-colors";

export interface DesignSystem {
    /**
     * The value typically used for backgrounds of elements
     */
    backgroundColor: string;

    /**
     * Configuration object to derive the neutral palette. Expects a ColorPaletteConfig from @microsoft/fast-colors
     */
    neutralPaletteConfig: ColorPaletteConfig;

    /**
     * Configuration object to derive the accent palette. Expects a ColorPaletteConfig from @microsoft/fast-colors
     */
    accentPaletteConfig: ColorPaletteConfig;

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
     * The density offset. Whole numbers, plus or minus 1 - 3.
     */
    density: number;

    /**
     * The grid-unit that UI dimensions are derived from
     */
    designUnit: number;

    /**
     * The number of designUnits in the default height at the base density (0).
     */
    defaultHeightMultiplier: number;

    /**
     * The number of designUnits used for horizontal padding at the base density (0).
     */
    defaultPaddingMultiplier: number;

    /**
     * The type ramp size to use at the base density (0).
     */
    defaultTypeRampSize: number;

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

    /**
     * The width of the outline in pixels applied to outline components
     */
    outlinePatternOutlineWidth?: number;

    /**
     * The width of the outline for focus state in pixels.
     */
    focusOutlineWidth: number;

    /**
     * The opacity to use for disabled component state.
     */
    disabledOpacity: number;
}

const designSystemDefaults: DesignSystem = {
    backgroundColor: white,
    contrast: 0,
    density: 0,
    designUnit: 4,
    defaultHeightMultiplier: 8,
    defaultPaddingMultiplier: 3,
    defaultTypeRampSize: 7,
    direction: Direction.ltr,
    cornerRadius: 2,
    outlinePatternOutlineWidth: 1,
    focusOutlineWidth: 2,
    neutralPaletteConfig,
    accentPaletteConfig,
    disabledOpacity: 0.3,

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
