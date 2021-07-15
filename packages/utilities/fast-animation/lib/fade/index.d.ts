import AnimateTo from "../animateTo";
/**
 * Key frame object for fade-in animations
 */
export declare const fadeInKeyframes: Array<Partial<Keyframe>>;
/**
 * Key frame object for fade-out animations
 */
export declare const fadeOutKeyframes: Array<Partial<Keyframe>>;
/**
 * EffectTiming defaults for fade animations
 */
export declare const fadeEffectTiming: EffectTiming;
export declare function applyFade(
    element: HTMLElement,
    keyframes: Array<Partial<Keyframe>>,
    timing?: EffectTiming
): AnimateTo;
/**
 * Creates an animation to fade an element into view
 *
 * @public
 */
export declare function fadeIn(
    element: HTMLElement,
    effectTiming?: EffectTiming
): AnimateTo;
/**
 * Creates an animation to fade an element out of view
 *
 * @public
 */
export declare function fadeOut(
    element: HTMLElement,
    effectTiming?: EffectTiming
): AnimateTo;
