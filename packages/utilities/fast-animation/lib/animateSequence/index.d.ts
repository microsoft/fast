import AnimateTo from "../animateTo";
import AnimateFrom from "../animateFrom";
/**
 * Animate a collection of {@link @microsoft/fast-animation#AnimateTo} and {@link @microsoft/fast-animation#AnimateFrom} in sequence.
 * @public
 */
declare class AnimateSequence {
    /**
     * onFinish callback method
     */
    onFinish: () => void;
    private animations;
    constructor(animations: Array<AnimateTo | AnimateFrom>);
    /**
     * Play the sequence of animations
     */
    play: () => void;
    /**
     * Play the sequence in reverse
     */
    reverse: () => void;
    /**
     * Pauses all animations in the sequence
     */
    pause: () => void;
    /**
     * Finishes all animations in the sequence
     */
    finish: () => void;
    /**
     * Cancels all animations in the sequence
     */
    cancel: () => void;
    /**
     * Sequences a set of animations and calls the specified method
     */
    private applySequencedCallback;
}
export default AnimateSequence;
