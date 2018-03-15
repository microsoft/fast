import AnimateTo from '../animateTo';
import AnimateFrom from '../animateFrom';

class AnimateSequence {
    constructor(animations: (AnimateTo | AnimateFrom)[]) {
        this.animations = animations; 
    }

    private animations: (AnimateTo | AnimateFrom)[];

    /**
     * onFinish callback method
     */
    public onFinish: () => void;

    /**
     * Sequences a set of animations and calls the specified method
     */
    private applySequencedCallback(animations: (AnimateTo | AnimateFrom)[], method: string) {
        let animationCount = animations.length;

        if (animationCount <= 0) {
            return;
        }

        animations.forEach((animation, index) => {
            // If this is not the last animation, format animation sequence chain
            if (index < animationCount - 1) {
                animation.onFinish = this.animations[index + 1][method];
            } else {
                // Else attach onFinish or nullify any existing onFinish on the animation
                animation.onFinish = this.onFinish || void(0); 
            }
        });

        animations[0][method]();
    }

    /**
     * Play the sequence of animations
     */
    public play = () => {
        this.applySequencedCallback(this.animations, 'play');
    }

    /**
     * Play the sequence in reverse
     */
    public reverse = () => {
        this.applySequencedCallback(this.animations.reverse(), 'reverse');
    }

    /**
     * Pauses all animations in the sequence
     */
    public pause = () => {
        this.animations.forEach(animation => animation.pause());
    }

    /**
     * Finishes all animations in the sequence
     */
    public finish = () => {
        this.animations.forEach(animation => animation.finish());
    }

    /**
     * Cancels all animations in the sequence
     */
    public cancel = () => {
        this.animations.forEach(animation => animation.cancel());
    }
}

export default AnimateSequence;
