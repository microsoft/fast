import { invokeFunctionForEach } from "../utilities/invokeFunctionForEach";
/**
 * Groups {@link @microsoft/fast-animation#AnimateTo} and {@link @microsoft/fast-animation#AnimateFrom} instances, providing a single API to operate on all of them.
 * @public
 */
class AnimateGroup {
    constructor(animations) {
        /**
         * Pauses all animations in the group
         */
        this.pause = () => {
            invokeFunctionForEach(this.animations, "pause");
        };
        /**
         * Finishes all animations in the group
         */
        this.finish = () => {
            invokeFunctionForEach(this.animations, "finish");
        };
        /**
         * Cancels all animations in the group
         */
        this.cancel = () => {
            invokeFunctionForEach(this.animations, "cancel");
        };
        this.animations = animations;
    }
    /**
     * The onFinish callback.
     */
    get onFinish() {
        return this._onFinish;
    }
    set onFinish(callback) {
        this._onFinish = callback;
        const longestRunning = this.getLongestAnimation();
        if (typeof longestRunning.onFinish === "function") {
            const fn = longestRunning.onFinish;
            longestRunning.onFinish = () => {
                fn();
                this._onFinish();
            };
        } else {
            longestRunning.onFinish = this._onFinish;
        }
    }
    /**
     * Play the group of animations
     */
    play() {
        invokeFunctionForEach(this.animations, "play");
    }
    /**
     * Reverses all animations in the group
     */
    reverse() {
        invokeFunctionForEach(this.animations, "reverse");
    }
    /**
     * Returns the longest running animation in the group
     */
    getLongestAnimation() {
        return this.animations.reduce((previousValue, currentValue) => {
            const previousDuration = this.getAnimationDuration(
                previousValue.effectTiming
            );
            const currentDuration = this.getAnimationDuration(currentValue.effectTiming);
            // If two durations in the group are equal, consider the higher index the
            // longest animation - this helps ensure the group onFinish callback
            // is fired after all individual animation onFinish callbacks have fired.
            return currentDuration >= previousDuration ? currentValue : previousValue;
        });
    }
    /**
     * Returns the cumulative time it will take to complete an animation
     */
    getAnimationDuration(effectTiming) {
        const duration = effectTiming.duration;
        const sanitizedDuration =
            typeof duration === "string" ? parseFloat(duration) : duration;
        return (effectTiming.delay || 0) + (sanitizedDuration || 0);
    }
}
export default AnimateGroup;
