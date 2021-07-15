import AnimateTo from "../animateTo";
import AnimateFrom from "../animateFrom";
/**
 * Groups {@link @microsoft/fast-animation#AnimateTo} and {@link @microsoft/fast-animation#AnimateFrom} instances, providing a single API to operate on all of them.
 * @public
 */
declare class AnimateGroup {
    /**
     * Stores the onFinish callback
     */
    private _onFinish;
    /**
     * Stores the group effect object
     */
    private animations;
    constructor(animations: Array<AnimateTo | AnimateFrom>);
    /**
     * The onFinish callback.
     */
    get onFinish(): () => void;
    set onFinish(callback: () => void);
    /**
     * Play the group of animations
     */
    play(): void;
    /**
     * Reverses all animations in the group
     */
    reverse(): void;
    /**
     * Pauses all animations in the group
     */
    pause: () => void;
    /**
     * Finishes all animations in the group
     */
    finish: () => void;
    /**
     * Cancels all animations in the group
     */
    cancel: () => void;
    /**
     * Returns the longest running animation in the group
     */
    private getLongestAnimation;
    /**
     * Returns the cumulative time it will take to complete an animation
     */
    private getAnimationDuration;
}
export default AnimateGroup;
