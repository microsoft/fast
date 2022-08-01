import { Swatch } from "./swatch.js";

/**
 * A recipe that evaluates a single color value.
 *
 * @public
 */
export interface ColorRecipe {
    /**
     * Evaluate a single color value.
     *
     * @param element - The element for which to evaluate the color recipe
     * @param reference - The reference color, implementation defaults to `fillColor`, but sometimes overridden for nested color recipes
     */
    evaluate(element: HTMLElement, reference?: Swatch): Swatch;
}

/**
 * A recipe that evaluates a color value for rest, hover, active, and focus states.
 *
 * @public
 */
export interface InteractiveColorRecipe {
    /**
     * Evaluate an interactive color set.
     *
     * @param element - The element for which to evaluate the color recipe
     * @param reference - The reference color, implementation defaults to `fillColor`, but sometimes overridden for nested color recipes
     */
    evaluate(element: HTMLElement, reference?: Swatch): InteractiveSwatchSet;
}

/**
 * A set of {@link Swatch}es to use for an interactive control's states.
 *
 * @public
 */
export interface InteractiveSwatchSet {
    /**
     * The Swatch to apply to the rest state.
     */
    rest: Swatch;

    /**
     * The Swatch to apply to the hover state.
     */
    hover: Swatch;

    /**
     * The Swatch to apply to the active state.
     */
    active: Swatch;

    /**
     * The Swatch to apply to the focus state.
     */
    focus: Swatch;
}
