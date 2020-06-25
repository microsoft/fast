import Animate, { AnimationMode } from "../animate";

/**
 * An animation to provided property values from the element's current values.
 * Extends {@link @microsoft/fast-animation#Animate}.
 * @public
 */
export default class AnimateTo extends Animate {
    protected mode: AnimationMode = AnimationMode.animateTo;
}
