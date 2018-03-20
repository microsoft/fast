import AnimateFrom from "../animateFrom";
import AnimateTo from "../animateTo";

/**
 * Key frame object for fade-in animations
 */
export const fadeInKeyframes: AnimationKeyFrame[] = [
    { opacity: 0.01 }, // Start at 0.01 due to a bug animating from 0
    { opacity: 1 }
];

/**
 * Key frame object for fade-out animations
 */
export const fadeOutKeyframes: AnimationKeyFrame[] = [
    { opacity: 1 },
    { opacity: 0 }
];

/**
 * EffectTiming defaults for fade animations
 */
export const fadeEffectTiming: AnimationEffectTiming = {
    easing: "linear",
    duration: 500
};

/**
 * Creates an animation to fade an element into view
 */
export function fadeIn(element: HTMLElement, effectTiming: AnimationEffectTiming = {}): AnimateTo {
    const fadeInEffectTiming: AnimationEffectTiming = Object.assign({}, fadeEffectTiming, effectTiming);
    const fadeInAnimation: AnimateTo = new AnimateTo(element, null, fadeInEffectTiming);

    fadeInAnimation.addKeyframes(fadeInKeyframes);

    return fadeInAnimation;
}

/**
 * Creates an animation to fade an element out of view
 */
export function fadeOut(element: HTMLElement, effectTiming: AnimationEffectTiming = {}): AnimateTo {
    const fadeOutEffectTiming: AnimationEffectTiming = Object.assign({}, fadeEffectTiming, effectTiming);
    const fadeOutAnimation: AnimateTo = new AnimateTo(element, null, fadeOutEffectTiming);

    fadeOutAnimation.addKeyframes(fadeOutKeyframes);

    return fadeOutAnimation;
}
