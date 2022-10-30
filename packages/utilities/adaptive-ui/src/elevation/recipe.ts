import { DesignTokenResolver } from "@microsoft/fast-foundation";

/**
 * A recipe that evaluates to an elevation treatment, commonly, but not limited to, a box shadow.
 *
 * @public
 */
export interface ElevationRecipe {
    /**
     * Evaluate an elevation treatment.
     *
     * @param resolver - A function that resolves design tokens
     * @param size - The size of the elevation
     */
    evaluate(resolver: DesignTokenResolver, size: number): string;
}
