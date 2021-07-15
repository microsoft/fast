import { invokeFunctionForEach } from "../utilities/invokeFunctionForEach";
/**
 * Animate a collection of {@link @microsoft/fast-animation#AnimateTo} and {@link @microsoft/fast-animation#AnimateFrom} in sequence.
 * @public
 */
class AnimateSequence {
    constructor(animations) {
        /**
         * Play the sequence of animations
         */
        this.play = () => {
            this.applySequencedCallback(this.animations, "play");
        };
        /**
         * Play the sequence in reverse
         */
        this.reverse = () => {
            this.applySequencedCallback(this.animations.reverse(), "reverse");
        };
        /**
         * Pauses all animations in the sequence
         */
        this.pause = () => {
            invokeFunctionForEach(this.animations, "pause");
        };
        /**
         * Finishes all animations in the sequence
         */
        this.finish = () => {
            invokeFunctionForEach(this.animations, "finish");
        };
        /**
         * Cancels all animations in the sequence
         */
        this.cancel = () => {
            invokeFunctionForEach(this.animations, "cancel");
        };
        this.animations = animations;
    }
    /**
     * Sequences a set of animations and calls the specified method
     */
    applySequencedCallback(animations, method) {
        const animationCount = animations.length;
        if (animationCount <= 0) {
            return;
        }
        animations.forEach((animation, index) => {
            // If this is not the last animation, format animation sequence chain
            if (index < animationCount - 1) {
                animation.onFinish = this.animations[index + 1][method];
            } else {
                // Else attach onFinish or nullify any existing onFinish on the animation
                animation.onFinish = this.onFinish || void 0;
            }
        });
        animations[0][method]();
    }
}
export default AnimateSequence;
