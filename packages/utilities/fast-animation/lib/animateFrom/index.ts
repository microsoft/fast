import Animate, { AnimationMode } from "../animate";

/**
 * An animation from provided property values to the element's current values.
 * Extends {@link @microsoft/fast-animation#Animate}.
 *
 * @public
 */
export default class AnimateFrom extends Animate {
    protected mode: AnimationMode = AnimationMode.animateFrom;
}
