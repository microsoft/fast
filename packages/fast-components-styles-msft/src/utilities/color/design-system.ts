import { white, neutralPaletteSource, accentPaletteSource } from "./color-constants";

export interface DesignSystem {
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
     * The index of the neutral palette being applied to the background.
     */
    backgroundColor: string;
}

/**
 * The default design system object
 */
export const designSystemDefaults: DesignSystem = {
    neutralPaletteSource,
    accentPaletteSource,
    backgroundColor: white,
};
/**
 * Ensure functions are using design system defaults
 */
export function withDesignSystemDefaults(
    designSystem: Partial<DesignSystem>
): DesignSystem {
    return Object.assign({}, designSystemDefaults, designSystem);
}

/**
 * Returns a function that calls the callback with designSystemDefaults ensured.
 */
export function ensureDesignSystemDefaults<T>(
    func: (designSystem: DesignSystem) => T
): (designSystem: DesignSystem) => T {
    return (designSystem: DesignSystem) => {
        return func(withDesignSystemDefaults(designSystem));
    };
}

/**
 * A function that accepts a design system and returns a generic type
 */
export type DesignSystemResolver<T> = (designSystem: DesignSystem) => T;
