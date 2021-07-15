import AnimateTo from "../animateTo";
/**
 * Key frame object for fade-in animations
 */
export const fadeInKeyframes = [{ opacity: "0.01" }, { opacity: "1" }];
/**
 * Key frame object for fade-out animations
 */
export const fadeOutKeyframes = [{ opacity: "1" }, { opacity: "0" }];
/**
 * EffectTiming defaults for fade animations
 */
export const fadeEffectTiming = {
    easing: "linear",
    duration: 500,
};
export function applyFade(element, keyframes, timing = {}) {
    const fadeAnimationTiming = Object.assign({}, fadeEffectTiming, timing);
    const fadeAnimation = new AnimateTo(element, null, fadeAnimationTiming);
    fadeAnimation.addKeyframes(keyframes);
    return fadeAnimation;
}
/**
 * Creates an animation to fade an element into view
 *
 * @public
 */
export function fadeIn(element, effectTiming = {}) {
    return applyFade(element, fadeInKeyframes, effectTiming);
}
/**
 * Creates an animation to fade an element out of view
 *
 * @public
 */
export function fadeOut(element, effectTiming = {}) {
    return applyFade(element, fadeOutKeyframes, effectTiming);
}
