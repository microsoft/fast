/**
 * A recipe that evaluates to an elevation treatment, commonly, but not limited to, a box .
 *
 * @public
 */
export interface ElevationRecipe {
    /**
     * Evaluate an elevation treatment.
     *
     * @param element - The element for which to evaluate the recipe
     * @param size - The size of the elevation
     */
    evaluate(element: HTMLElement, size: number): string;
}
