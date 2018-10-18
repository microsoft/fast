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
    scale?: ScaleFactor;

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
 * Scale factor is either a single number that scales both x and y dependently, or two numbers that scale x and y respectively
 */
export type ScaleFactor = number | [number, number];

/**
 * Animation mode describes if an animation should animate toward an elements natural position or away from it
 */
export enum AnimationMode {
    animateTo,
    animateFrom
}

/**
 * Maps css property names to animation options
 */
export interface PropertyMap {
    opacity: string[];
    transform: string[];
    top: string[];
    left: string[];
    bottom: string[];
    right: string[];
}

export default abstract class Animate {
    /**
     * A mapping between animation options and the css property names they apply to
     */
    private static propertyMap: PropertyMap = {
        opacity: ["opacity"],
        transform: ["x", "y", "rotate", "scale"],
        top: ["top"],
        left: ["left"],
        bottom: ["bottom"],
        right: ["right"]
    };

    /**
     * Stores animation options
     */
    public options: AnimateConfig;

    /**
     * Stores animation timing functions
     */
    public effectTiming: EffectTiming = {
        fill: "forwards",
        iterations: 1,
        duration: 500
    };

    /**
     * Callback to call when the animation is canceled
     */
    public onCancel: () => void;

    /**
     * Tracks if the animation should animate toward an elements natural position or away from it
     */
    protected mode: AnimationMode;

    /**
     * Stores the HTML element to be animated
     */
    private animationTarget: HTMLElement;

    /**
     * Stores the WAAPI object for manipulation by our API
     */
    private animation: Animation;

    /**
     * Callback to call when the animation finishes playing
     */
    private _onFinish: () => void;

    /**
     * Stores animation keyframe sets and is accessed by a getter
     */
    private _keyframes: Keyframe[][] = [];

    public get onFinish(): () => void {
        return this._onFinish;
    }

    public set onFinish(callback: () => void) {
        this._onFinish = callback;

        if (Boolean(this.animation)) {
            this.animation.onfinish = callback;
        }
    }

    constructor(
        element: HTMLElement,
        options?: AnimateConfig,
        effectTiming?: EffectTiming
    ) {
        this.animationTarget = element;

        if (Boolean(effectTiming)) {
            this.effectTiming = Object.assign({}, this.effectTiming, effectTiming);
        }

        if (options) {
            if (options.transformOrigin) {
                element.style.transformOrigin = options.transformOrigin;
            }

            if (options.transformStyle) {
                element.style.transformStyle = options.transformStyle;
            }
        }

        this.options = options || {};
    }

    /**
     * plays the animation
     */
    public play = (): void => {
        this.ensureAnimationObjectExists();
        this.animation.play();
    };

    /**
     * pauses the animation
     */
    public pause = (): void => {
        this.ensureAnimationObjectExists();
        this.animation.pause();
    };

    /**
     * finishes the animation
     */
    public finish = (): void => {
        this.ensureAnimationObjectExists();
        this.animation.finish();
    };

    /**
     * cancels the animation
     */
    public cancel = (): void => {
        this.ensureAnimationObjectExists();
        this.animation.cancel();
    };

    /**
     * reverses an animation
     */
    public reverse = (): void => {
        this.ensureAnimationObjectExists();
        this.animation.reverse();
    };

    /**
     * adds a set of keyframes to set of animation keyframes the animation should execute
     */
    public addKeyframes = (keyframes: Array<Partial<Keyframe>>): void => {
        this._keyframes.push(keyframes as Keyframe[]);
    };

    /**
     * Ensure animation object
     */
    private ensureAnimationObjectExists(): void {
        if (typeof this.animation === "undefined") {
            this.createAnimationObject();
        }
    }
    /**
     * Creates the animation object
     */
    private createAnimationObject(): void {
        this.animation = new Animation(this.keyframeEffect, document.timeline);

        if (typeof this.onFinish !== "undefined") {
            this.animation.onfinish = this.onFinish;
        }

        if (typeof this.onCancel !== "undefined") {
            this.animation.oncancel = this.onCancel;
        }
    }

    /**
     * Returns a list of properties that will be animated based options
     */
    private getPropertiesToAnimate(): string[] {
        return Object.keys(Animate.propertyMap).filter((property: string) => {
            // Filter out all properties that don't need to be set based on our options
            return Animate.propertyMap[property].reduce(
                (hasProperty: boolean, animationProp: string) => {
                    return (
                        typeof this.options[animationProp] !== "undefined" || hasProperty
                    );
                },
                false
            );
        });
    }

    /**
     * Current implmentations of web animations seem to have trouble animating both scale and opacity
     * from a starting value of 0. This method detects when those values are 0 and alters them slightly
     * to known-working starting values
     */
    private normalizeInitialValue(property: string, value: string): string {
        if (value === undefined) {
            return;
        }

        const coercedReturn: string = "0.01";

        switch (property) {
            case "transform":
                const matrixValuesRegex: RegExp = /matrix\((.+)\)/;
                const matrixValues: string[] | null = value.match(matrixValuesRegex);

                if (Array.isArray(matrixValues)) {
                    const normalizedValues: string[] = matrixValues[1]
                        .split(",")
                        .map((matchedValue: string, index: number) => {
                            const parsedValueIsZero: boolean = parseFloat(value) === 0;

                            if (!parsedValueIsZero) {
                                return matchedValue;
                            }

                            // If this is the scaleX index or the scaleY index, return the coerced value
                            return index === 0 || index === 3
                                ? coercedReturn
                                : matchedValue;
                        });

                    return `matrix(${normalizedValues.join(",")})`;
                }

                break;
            case "opacity":
                return parseFloat(value) === 0 ? coercedReturn : value;
        }

        return value;
    }

    /**
     * Returns the initial values for all properties being animated
     */
    private getInitialKeyframeValues(): Keyframe {
        if (
            !(this.animationTarget instanceof HTMLElement) ||
            typeof window === "undefined"
        ) {
            return {} as Keyframe;
        }

        const animatedProperties: string[] = this.getPropertiesToAnimate();
        const computedStyle: CSSStyleDeclaration = window.getComputedStyle(
            this.animationTarget
        );
        const initialKeyframeValues: Partial<Keyframe> = {};

        animatedProperties.forEach((property: string) => {
            initialKeyframeValues[property] = this.normalizeInitialValue(
                property,
                computedStyle[property]
            );
        });

        return initialKeyframeValues as Keyframe;
    }

    /**
     * Formats a config option into a transform function
     */
    private formatTransformFunction(
        functionType: string,
        value: string | number | number[]
    ): string {
        // If `functionType` can't be converted into a transform function, just return empty string
        if (Animate.propertyMap.transform.indexOf(functionType) === -1) {
            return "";
        }

        switch (functionType) {
            case "x":
            case "y":
                functionType = `translate${functionType.toUpperCase()}`;
                value =
                    typeof value === "number" ? (value = this.pixelify(value)) : value;
                break;
            case "rotate":
                value = `${value.toString()}deg`;
                break;
            case "scale":
                if (value === 0) {
                    // There is a strange bug where you can't animate from a scale 0
                    value = 0.01;
                }
        }

        if (typeof value !== "string") {
            value = value.toString();
        }

        return `${functionType}(${value})`;
    }

    /**
     * Converts a number to a pixel string
     */
    private pixelify(num: number): string {
        return `${num}px`;
    }

    /**
     * Returns keyframe values based on option configuration
     */
    private getOptionKeyframeValues(): Keyframe {
        const animateProperties: string[] = this.getPropertiesToAnimate();
        const keyframeValues: Partial<Keyframe> = {};

        animateProperties.forEach((property: string) => {
            keyframeValues[property] = Animate.propertyMap[property]
                .map(
                    (option: string): string => {
                        const value: string | number = this.options[option];

                        if (typeof value === "undefined") {
                            return null;
                        }

                        switch (option) {
                            case "opacity":
                                return value.toString();
                            case "top":
                            case "right":
                            case "bottom":
                            case "left":
                                return typeof value === "number"
                                    ? this.pixelify(value)
                                    : value;
                            default:
                                return this.formatTransformFunction(option, value);
                        }
                    }
                )
                .filter((option: string) => Boolean(option))
                .join(" ");
        });

        return keyframeValues as Keyframe;
    }

    /**
     * Gets all keyframes configured by options
     */
    private getOptionKeyframes(): Keyframe[] {
        const keyframes: Keyframe[] = [
            this.getInitialKeyframeValues(),
            this.getOptionKeyframeValues()
        ];

        return this.mode === AnimationMode.animateFrom ? keyframes.reverse() : keyframes;
    }

    /**
     * Sorts an array of offset keys in ascending order
     */
    private sortOffsets(offsets: string[]): string[] {
        return offsets.sort(
            (a: string, b: string): number => {
                const A: number = parseFloat(a);
                const B: number = parseFloat(b);

                if (A < B) {
                    return -1;
                } else if (A > B) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    }

    /**
     * Consolidates all keyframe arrays into a single keyframe array
     */
    private consolidateKeyframes(keyframeSets: Keyframe[][]): Keyframe[] {
        const frames: Partial<Keyframe[]> = [];

        // Merge all keyframes into a single frames object where each key is a keyframe offset
        keyframeSets.forEach((keyframeSet: Keyframe[]) => {
            keyframeSet.forEach((keyframe: Keyframe, index: number) => {
                let offset: number | number[] = keyframe.offset;

                if (typeof offset === "undefined") {
                    offset = index === 0 ? 0 : 1;
                    keyframe.offset = offset;
                }

                const offsetKey: string = offset.toString();

                frames[offsetKey] =
                    typeof frames[offsetKey] === "undefined"
                        ? keyframe
                        : Object.assign(frames[offsetKey], keyframe);
            });
        });

        return this.sortOffsets(Object.keys(frames)).map((offset: string) => {
            return frames[offset];
        });
    }

    /**
     * Returns the animation's keyframes
     */
    public get keyframes(): Keyframe[] {
        const optionKeyframes: Keyframe[] = this.getOptionKeyframes();

        return this.consolidateKeyframes(
            this._keyframes.concat([this.getOptionKeyframes()])
        );
    }

    /**
     * Returns the key frame effect object
     */
    public get keyframeEffect(): KeyframeEffect {
        return new KeyframeEffect(
            this.animationTarget,
            this.keyframes,
            this.effectTiming
        );
    }
}
