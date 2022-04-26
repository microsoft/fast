import { Swatch } from "./swatch.js";

/**
 * A set of {@link Swatch}es to use for an interactive control's states.
 *
 * @public
 */
export interface InteractiveSwatchSet {
    /**
     * The Swatch to apply to the rest state
     */
    rest: Swatch;

    /**
     * The Swatch to apply to the hover state
     */
    hover: Swatch;

    /**
     * The Swatch to apply to the active state
     */
    active: Swatch;

    /**
     * The Swatch to apply to the focus state
     */
    focus: Swatch;
}
