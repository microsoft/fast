import AnimateTo from "../animateTo";
import AnimateFrom from "../animateFrom";

class AnimateGroup {
    /**
     * Stores the onFinish callback
     */
    private _onFinish: () => void;

    /**
     * Stores the group effect object
     */
    private animations: Array<AnimateTo | AnimateFrom>;

    constructor(animations: Array<AnimateTo | AnimateFrom>) {
        this.animations = animations;
    }

    /**
     * Expose onFinish callback
     */
    public set onFinish(callback: () => void): void {
        this._onFinish = callback;

        this.getLongestAnimation().onFinish = callback;
    }

    /**
     * Play the group of animations
     */
    public play(): void {
        this.animations.forEach((animation: AnimateTo |  AnimateFrom) => animation.play());
    }

    /**
     * Reverses all animations in the group
     */

    public reverse(): void {
        this.animations.forEach((animation: AnimateTo |  AnimateFrom) => animation.reverse());
    }

    /**
     * Pauses all animations in the group
     */
    public pause = (): void => {
        this.animations.forEach((animation: AnimateTo |  AnimateFrom) => animation.pause());
    }

    /**
     * Finishes all animations in the group
     */
    public finish = (): void => {
        this.animations.forEach((animation: AnimateTo |  AnimateFrom) => animation.finish());
    }

    /**
     * Cancels all animations in the group
     */
    public cancel = (): void => {
        this.animations.forEach((animation: AnimateTo |  AnimateFrom) => animation.cancel());
    }
    /**
     * Returns the longest running animation in the group
     */
    private getLongestAnimation(): AnimateTo | AnimateFrom {
        return this.animations.reduce((previousValue: AnimateTo | AnimateFrom, currentValue: AnimateTo | AnimateFrom) => {
            const previousDuration: number = this.getAnimationDuration(previousValue.effectTiming);
            const currentDuration: number = this.getAnimationDuration(currentValue.effectTiming);

            return currentDuration > previousDuration ? currentValue : previousValue;
        });
    }

    /**
     * Returns the cumulative time it will take to complete an animation
     */
    private getAnimationDuration(effectTiming: AnimationEffectTiming): number {
        return (effectTiming.delay || 0) + (effectTiming.duration || 0);
    }
}

export default AnimateGroup;
