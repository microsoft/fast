import Animate, { AnimationMode } from "../animate";

/**
 * An animation to provided property values from the element's current values.
 * @public
 */
export default class AnimateTo extends Animate {
    protected mode: AnimationMode = AnimationMode.animateTo;
}
