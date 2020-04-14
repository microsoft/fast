import AnimateTo from "../animateTo";
import AnimateFrom from "../animateFrom";
import { invokeFunctionForEach } from "../utilities/invokeFunctionForEach";

class AnimateSequence {
    /**
     * onFinish callback method
     */
    public onFinish: () => void;

    private animations: Array<AnimateTo | AnimateFrom>;

    constructor(animations: Array<AnimateTo | AnimateFrom>) {
        this.animations = animations;
    }

    /**
     * Play the sequence of animations
     */
    public play = (): void => {
        this.applySequencedCallback(this.animations, "play");
    };

    /**
     * Play the sequence in reverse
     */
    public reverse = (): void => {
        this.applySequencedCallback(this.animations.reverse(), "reverse");
    };

    /**
     * Pauses all animations in the sequence
     */
    public pause = (): void => {
        invokeFunctionForEach(this.animations, "pause");
    };

    /**
     * Finishes all animations in the sequence
     */
    public finish = (): void => {
        invokeFunctionForEach(this.animations, "finish");
    };

    /**
     * Cancels all animations in the sequence
     */
    public cancel = (): void => {
        invokeFunctionForEach(this.animations, "cancel");
    };

    /**
     * Sequences a set of animations and calls the specified method
     */
    private applySequencedCallback(
        animations: Array<AnimateTo | AnimateFrom>,
        method: string
    ): void {
        const animationCount: number = animations.length;

        if (animationCount <= 0) {
            return;
        }

        animations.forEach((animation: AnimateTo | AnimateFrom, index: number) => {
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
