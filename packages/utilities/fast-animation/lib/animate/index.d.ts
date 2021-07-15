/**
 * Describes the animation properties
 * @public
 */
export interface AnimateConfig {
    /**
     * The x position change of the animation
     */
    x?: number | string;
    /**
     * The y position change of the animation
     */
    y?: number | string;
    /**
     * The top property
     */
    top?: number | string;
    /**
     * The right property
     */
    right?: number | string;
    /**
     * The bottom proper
     */
    bottom?: number | string;
    /**
     * The left property
     */
    left?: number | string;
    /**
     * The rotation of the animation in degrees
     */
    rotate?: number;
    /**
     * The scale factor of the animation
     */
    scale?: number | [number, number];
    /**
     * The opacity after the animation
     */
    opacity?: number;
    /**
     * The transform-origin for the element
     */
    transformOrigin?: string;
    /**
     * The transform-style for the element
     */
    transformStyle?: string;
}
/**
 * Enumerates all properties that can be animated, outside of properties supplied directly via Animate.addKeyframes()
 * @public
 */
export interface AnimationProperties {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    opacity?: number;
    transform?: string;
}
/**
 * Animation mode describes if an animation should animate toward an elements natural position or away from it
 *
 * @internal
 */
export declare enum AnimationMode {
    animateTo = 0,
    animateFrom = 1,
}
/**
 * Base animate type. This is extended by {@link @microsoft/fast-animation#AnimateTo} and {@link @microsoft/fast-animation#AnimateFrom}.
 *
 * @public
 */
export default abstract class Animate {
    /**
     * A mapping between animation options and the css property names they apply to
     */
    private static propertyMap;
    /**
     * Stores animation options
     */
    options: AnimateConfig;
    /**
     * Stores animation timing functions
     */
    effectTiming: EffectTiming;
    /**
     * Callback to call when the animation is canceled
     */
    onCancel: () => void;
    /**
     * Tracks if the animation should animate toward an elements natural position or away from it
     */
    protected mode: AnimationMode;
    /**
     * Stores the HTML element to be animated
     */
    private animationTarget;
    /**
     * Stores the WAAPI object for manipulation by our API
     */
    private animation;
    /**
     * Callback to call when the animation finishes playing
     */
    private _onFinish;
    /**
     * Stores animation keyframe sets and is accessed by a getter
     */
    private _keyframes;
    get onFinish(): () => void;
    set onFinish(callback: () => void);
    constructor(
        element: HTMLElement,
        options?: AnimateConfig,
        effectTiming?: EffectTiming
    );
    /**
     * plays the animation
     */
    play: () => void;
    /**
     * pauses the animation
     */
    pause: () => void;
    /**
     * finishes the animation
     */
    finish: () => void;
    /**
     * cancels the animation
     */
    cancel: () => void;
    /**
     * reverses an animation
     */
    reverse: () => void;
    /**
     * adds a set of keyframes to set of animation keyframes the animation should execute
     */
    addKeyframes: (keyframes: Array<Partial<Keyframe>>) => void;
    /**
     * Ensure animation object
     */
    private ensureAnimationObjectExists;
    /**
     * Creates the animation object
     */
    private createAnimationObject;
    /**
     * Returns a list of properties that will be animated based options
     */
    private getPropertiesToAnimate;
    /**
     * Current implmentations of web animations seem to have trouble animating both scale and opacity
     * from a starting value of 0. This method detects when those values are 0 and alters them slightly
     * to known-working starting values
     */
    private normalizeInitialValue;
    /**
     * Returns the initial values for all properties being animated
     */
    private getInitialKeyframeValues;
    /**
     * Formats a config option into a transform function
     */
    private formatTransformFunction;
    /**
     * Converts a number to a pixel string
     */
    private pixelify;
    /**
     * Returns keyframe values based on option configuration
     */
    private getOptionKeyframeValues;
    /**
     * Gets all keyframes configured by options
     */
    private getOptionKeyframes;
    /**
     * Sorts an array of offset keys in ascending order
     */
    private sortOffsets;
    /**
     * Consolidates all keyframe arrays into a single keyframe array
     */
    private consolidateKeyframes;
    /**
     * Returns the animation's keyframes
     */
    get keyframes(): Keyframe[];
    /**
     * Returns the key frame effect object
     */
    get keyframeEffect(): KeyframeEffect;
}
