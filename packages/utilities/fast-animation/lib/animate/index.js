/**
 * Animation mode describes if an animation should animate toward an elements natural position or away from it
 *
 * @internal
 */
export var AnimationMode;
(function (AnimationMode) {
    AnimationMode[(AnimationMode["animateTo"] = 0)] = "animateTo";
    AnimationMode[(AnimationMode["animateFrom"] = 1)] = "animateFrom";
})(AnimationMode || (AnimationMode = {}));
/**
 * Base animate type. This is extended by {@link @microsoft/fast-animation#AnimateTo} and {@link @microsoft/fast-animation#AnimateFrom}.
 *
 * @public
 */
export default class Animate {
    constructor(element, options, effectTiming) {
        /**
         * Stores animation timing functions
         */
        this.effectTiming = {
            fill: "forwards",
            iterations: 1,
            duration: 500,
        };
        /**
         * Stores animation keyframe sets and is accessed by a getter
         */
        this._keyframes = [];
        /**
         * plays the animation
         */
        this.play = () => {
            this.ensureAnimationObjectExists();
            this.animation.play();
        };
        /**
         * pauses the animation
         */
        this.pause = () => {
            this.ensureAnimationObjectExists();
            this.animation.pause();
        };
        /**
         * finishes the animation
         */
        this.finish = () => {
            this.ensureAnimationObjectExists();
            this.animation.finish();
        };
        /**
         * cancels the animation
         */
        this.cancel = () => {
            this.ensureAnimationObjectExists();
            this.animation.cancel();
        };
        /**
         * reverses an animation
         */
        this.reverse = () => {
            this.ensureAnimationObjectExists();
            this.animation.reverse();
        };
        /**
         * adds a set of keyframes to set of animation keyframes the animation should execute
         */
        this.addKeyframes = keyframes => {
            this._keyframes.push(keyframes);
        };
        this.animationTarget = element;
        if (effectTiming) {
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
    get onFinish() {
        return this._onFinish;
    }
    set onFinish(callback) {
        this._onFinish = callback;
        if (this.animation) {
            this.animation.onfinish = callback;
        }
    }
    /**
     * Ensure animation object
     */
    ensureAnimationObjectExists() {
        if (typeof this.animation === "undefined") {
            this.createAnimationObject();
        }
    }
    /**
     * Creates the animation object
     */
    createAnimationObject() {
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
    getPropertiesToAnimate() {
        return Object.keys(Animate.propertyMap).filter(property => {
            // Filter out all properties that don't need to be set based on our options
            return Animate.propertyMap[property].reduce((hasProperty, animationProp) => {
                return typeof this.options[animationProp] !== "undefined" || hasProperty;
            }, false);
        });
    }
    /**
     * Current implmentations of web animations seem to have trouble animating both scale and opacity
     * from a starting value of 0. This method detects when those values are 0 and alters them slightly
     * to known-working starting values
     */
    normalizeInitialValue(property, value) {
        if (value === undefined) {
            return;
        }
        const coercedReturn = "0.01";
        switch (property) {
            case "transform":
                /* eslint-disable */
                const matrixValuesRegex = /matrix\((.+)\)/;
                const matrixValues = value.match(matrixValuesRegex);
                /* eslint-enable */
                if (Array.isArray(matrixValues)) {
                    const normalizedValues = matrixValues[1]
                        .split(",")
                        .map((matchedValue, index) => {
                            const parsedValueIsZero = parseFloat(value) === 0;
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
    getInitialKeyframeValues() {
        if (
            !(this.animationTarget instanceof HTMLElement) ||
            typeof window === "undefined"
        ) {
            return {};
        }
        const animatedProperties = this.getPropertiesToAnimate();
        const computedStyle = window.getComputedStyle(this.animationTarget);
        const initialKeyframeValues = {};
        animatedProperties.forEach(property => {
            initialKeyframeValues[property] = this.normalizeInitialValue(
                property,
                computedStyle[property]
            );
        });
        return initialKeyframeValues;
    }
    /**
     * Formats a config option into a transform function
     */
    formatTransformFunction(functionType, value) {
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
    pixelify(num) {
        return `${num}px`;
    }
    /**
     * Returns keyframe values based on option configuration
     */
    getOptionKeyframeValues() {
        const animateProperties = this.getPropertiesToAnimate();
        const keyframeValues = {};
        animateProperties.forEach(property => {
            keyframeValues[property] = Animate.propertyMap[property]
                .map(option => {
                    const value = this.options[option];
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
                })
                .filter(option => Boolean(option))
                .join(" ");
        });
        return keyframeValues;
    }
    /**
     * Gets all keyframes configured by options
     */
    getOptionKeyframes() {
        const keyframes = [
            this.getInitialKeyframeValues(),
            this.getOptionKeyframeValues(),
        ];
        return this.mode === AnimationMode.animateFrom ? keyframes.reverse() : keyframes;
    }
    /**
     * Sorts an array of offset keys in ascending order
     */
    sortOffsets(offsets) {
        return offsets.sort((a, b) => {
            const A = parseFloat(a);
            const B = parseFloat(b);
            if (A < B) {
                return -1;
            } else if (A > B) {
                return 1;
            } else {
                return 0;
            }
        });
    }
    /**
     * Consolidates all keyframe arrays into a single keyframe array
     */
    consolidateKeyframes(keyframeSets) {
        const frames = [];
        // Merge all keyframes into a single frames object where each key is a keyframe offset
        keyframeSets.forEach(keyframeSet => {
            keyframeSet.forEach((keyframe, index) => {
                let offset = keyframe.offset;
                if (typeof offset === "undefined") {
                    offset = index === 0 ? 0 : 1;
                    keyframe.offset = offset;
                }
                const offsetKey = offset.toString();
                frames[offsetKey] =
                    typeof frames[offsetKey] === "undefined"
                        ? keyframe
                        : Object.assign(frames[offsetKey], keyframe);
            });
        });
        return this.sortOffsets(Object.keys(frames)).map(offset => {
            return frames[offset];
        });
    }
    /**
     * Returns the animation's keyframes
     */
    get keyframes() {
        return this.consolidateKeyframes(
            this._keyframes.concat([this.getOptionKeyframes()])
        );
    }
    /**
     * Returns the key frame effect object
     */
    get keyframeEffect() {
        return new KeyframeEffect(
            this.animationTarget,
            this.keyframes,
            this.effectTiming
        );
    }
}
/**
 * A mapping between animation options and the css property names they apply to
 */
Animate.propertyMap = {
    opacity: ["opacity"],
    transform: ["x", "y", "rotate", "scale"],
    top: ["top"],
    left: ["left"],
    bottom: ["bottom"],
    right: ["right"],
};
