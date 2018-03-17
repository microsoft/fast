import AnimateTo from "../animateTo";
import AnimateFrom from "../animateFrom";

class AnimateGroup {
    constructor(animations: Array<AnimateTo | AnimateFrom>) {
        this.animations = animations;
    }

    /**
     * Stores the group effect object
     */
    private animations: Array<AnimateTo | AnimateFrom>;

    /**
     * Returns the longest running animation in the group
     */
    private getLongestAnimation(): AnimateTo | AnimateFrom {
        return this.animations.reduce((previousValue, currentValue) => {
            const previousDuration = this.getAnimationDuration(previousValue.effectTiming);
            const currentDuration = this.getAnimationDuration(currentValue.effectTiming);

            return currentDuration > previousDuration ? currentValue : previousValue;
        });
    }

    /**
     * Returns the cumulative time it will take to complete an animation
     */
    private getAnimationDuration(effectTiming: AnimationEffectTiming): number {
        return (effectTiming.delay || 0) + (effectTiming.duration || 0);
    }

    /**
     * Stores the onFinish callback
     */
    private _onFinish: () => void;

    /**
     * Expose onFinish callback
     */
    public set onFinish(callback: () => void) {
        this._onFinish = callback;

        this.getLongestAnimation().onFinish = callback;
    }

    /**
     * Play the group of animations
     */
    public play() {
        this.animations.forEach((animation) => animation.play());
    }

    /**
     * Reverses all animations in the group
     */
    public reverse() {
        this.animations.forEach((animation) => animation.reverse());
    }

    /**
     * Pauses all animations in the group
     */
    public pause = () => {
        this.animations.forEach((animation) => animation.pause());
    }

    /**
     * Finishes all animations in the group
     */
    public finish = () => {
        this.animations.forEach((animation) => animation.finish());
    }

    /**
     * Cancels all animations in the group
     */
    public cancel = () => {
        this.animations.forEach((animation) => animation.cancel());
    }
}

export default AnimateGroup;
