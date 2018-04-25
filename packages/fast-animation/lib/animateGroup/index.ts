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
    public set onFinish(callback: () => void) {
        this._onFinish = callback;

        this.getLongestAnimation().onFinish = callback;
    }

    /**
     * Play the group of animations
     */
    public play(): void {
        this.action("play");
    }

    /**
     * Reverses all animations in the group
     */

    public reverse(): void {
        this.action("reverse");
    }

    /**
     * Pauses all animations in the group
     */
    public pause = (): void => {
        this.action("pause");
    }

    /**
     * Finishes all animations in the group
     */
    public finish = (): void => {
        this.action("finish");
    }

    /**
     * Cancels all animations in the group
     */
    public cancel = (): void => {
        this.action("cancel");
    }

    private action = (name: string): void => {
        this.animations.forEach((animation: AnimateTo | AnimateFrom) => animation[name]());
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
