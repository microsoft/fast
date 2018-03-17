import AnimateFrom from "../animateFrom";
import AnimateTo from "../animateTo";

/**
 * Key frame object for fade-in animations
 */
export const fadeInKeyframes = [
    { opacity: 0.01 }, // Start at 0.01 due to a bug animating from 0
    { opacity: 1 }
];

/**
 * Key frame object for fade-out animations
 */
export const fadeOutKeyframes = [
    { opacity: 1 },
    { opacity: 0 }
];

/**
 * EffectTiming defaults for fade animations
 */
export const fadeEffectTiming = {
    easing: "linear",
    duration: 500
};

/**
 * Creates an animation to fade an element into view
 */
export function fadeIn(element: HTMLElement, effectTiming: AnimationEffectTiming = {}): AnimateTo {
    const fadeInEffectTiming = Object.assign({}, fadeEffectTiming, effectTiming);
    const fadeIn = new AnimateTo(element, null, fadeInEffectTiming);

    fadeIn.addKeyframes(fadeInKeyframes);

    return fadeIn;
}

/**
 * Creates an animation to fade an element out of view
 */
export function fadeOut(element: HTMLElement, effectTiming: AnimationEffectTiming = {}): AnimateTo {
    const fadeOutEffectTiming = Object.assign({}, fadeEffectTiming, effectTiming);
    const fadeOut = new AnimateTo(element, null, fadeOutEffectTiming);

    fadeOut.addKeyframes(fadeOutKeyframes);

    return fadeOut;
}
