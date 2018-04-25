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
    return applyFade(element, fadeInKeyframes, effectTiming);
}

/**
 * Creates an animation to fade an element out of view
 */
export function fadeOut(element: HTMLElement, effectTiming: AnimationEffectTiming = {}): AnimateTo {
    return applyFade(element, fadeOutKeyframes, effectTiming);
}

export function applyFade(element: HTMLElement, keyframes: AnimationKeyFrame[], timing: AnimationEffectTiming = {}): AnimateTo {
    const fadeAnimationTiming: AnimationEffectTiming = Object.assign({}, fadeEffectTiming, timing);
    const fadeAnimation: AnimateTo = new AnimateTo(element, null, fadeAnimationTiming);

    fadeAnimation.addKeyframes(keyframes);

    return fadeAnimation;
}
