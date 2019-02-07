import { Direction } from "@microsoft/fast-application-utilities";
import { withDefaults } from "@microsoft/fast-jss-utilities";
import {
    accentPaletteSource,
    neutralPaletteSource,
    white,
} from "../utilities/color/color-constants";

export interface DesignSystem {
    /**
     * The value typically used for backgrounds of elements
     */
    backgroundColor: string;

    /**
     * The source colors used to create the neutral color palette.
     * This should be an array of strings representing colors in
     * RGB or HEX format. Color sources should be ordered from light to dark
     */
    neutralPaletteSource: string[];

    /**
     * The source colors used to create the accent color palette.
     * This should be an array of strings representing colors in
     * RGB or HEX format. Color sources should be ordered from light to dark
     */
    accentPaletteSource: string[];

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
}

const designSystemDefaults: DesignSystem = {
    backgroundColor: white,
    contrast: 0,
    density: 1,
    designUnit: 4,
    direction: Direction.ltr,
    cornerRadius: 2,
    outlinePatternOutlineWidth: 1,
    neutralPaletteSource,
    accentPaletteSource,

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
