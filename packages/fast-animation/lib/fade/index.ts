import AnimateFrom from "../animateFrom";
import AnimateTo from "../animateTo";
import { IAnimateOptions } from "../animate";

/**
 * Key frame object for fade-in animations
 */
export const fadeInKeyframes: Array<Partial<Keyframe>> = [
    { opacity: "0.01" }, // Start at 0.01 due to a bug animating from 0
    { opacity: "1" }
];

/**
 * Key frame object for fade-out animations
 */
export const fadeOutKeyframes: Array<Partial<Keyframe>> = [
    { opacity: "1" },
    { opacity: "0" }
];

/**
 * EffectTiming defaults for fade animations
 */
export const fadeEffectTiming: EffectTiming = {
    easing: "linear",
    duration: 500
};

/**
 * Creates an animation to fade an element into view
 */
export function fadeIn(element: HTMLElement, effectTiming: EffectTiming = {}): AnimateTo {
    return applyFade(element, fadeInKeyframes, effectTiming);
}

/**
 * Creates an animation to fade an element out of view
 */
export function fadeOut(element: HTMLElement, effectTiming: EffectTiming = {}): AnimateTo {
    return applyFade(element, fadeOutKeyframes, effectTiming);
}

export function applyFade(element: HTMLElement, keyframes: Array<Partial<Keyframe>>, timing: EffectTiming = {}): AnimateTo {
    const fadeAnimationTiming: EffectTiming = Object.assign({}, fadeEffectTiming, timing);
    const fadeAnimation: AnimateTo = new AnimateTo(element, null, fadeAnimationTiming);

    fadeAnimation.addKeyframes(keyframes);

    return fadeAnimation;
}
