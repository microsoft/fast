import { Swatch } from "./swatch.js";

/** @public */
export interface InteractiveSwatchSet {
    /**
     * The swatch to apply to the rest state
     */
    rest: Swatch;

    /**
     * The swatch to apply to the hover state
     */
    hover: Swatch;

    /**
     * The swatch to apply to the active state
     */
    active: Swatch;

    /**
     * The swatch to apply to the focus state
     */
    focus: Swatch;
}
