import { contrastRatio } from "./color-converters";
import { ColorInterpolationSpace, interpolateByColorSpace } from "./color-interpolation";
/**
 * A color scale created from linear stops
 * @public
 */
export class ColorScale {
    constructor(stops) {
        if (stops == null || stops.length === 0) {
            throw new Error("The stops argument must be non-empty");
        } else {
            this.stops = this.sortColorScaleStops(stops);
        }
    }
    static createBalancedColorScale(colors) {
        if (colors == null || colors.length === 0) {
            throw new Error("The colors argument must be non-empty");
        }
        const stops = new Array(colors.length);
        for (let i = 0; i < colors.length; i++) {
            // Special case first and last in order to avoid floating point jaggies
            if (i === 0) {
                stops[i] = { color: colors[i], position: 0 };
            } else if (i === colors.length - 1) {
                stops[i] = { color: colors[i], position: 1 };
            } else {
                stops[i] = {
                    color: colors[i],
                    position: i * (1 / (colors.length - 1)),
                };
            }
        }
        return new ColorScale(stops);
    }
    getColor(position, interpolationMode = ColorInterpolationSpace.RGB) {
        if (this.stops.length === 1) {
            return this.stops[0].color;
        } else if (position <= 0) {
            return this.stops[0].color;
        } else if (position >= 1) {
            return this.stops[this.stops.length - 1].color;
        }
        let lowerIndex = 0;
        for (let i = 0; i < this.stops.length; i++) {
            if (this.stops[i].position <= position) {
                lowerIndex = i;
            }
        }
        let upperIndex = lowerIndex + 1;
        if (upperIndex >= this.stops.length) {
            upperIndex = this.stops.length - 1;
        }
        const scalePosition =
            (position - this.stops[lowerIndex].position) *
            (1.0 / (this.stops[upperIndex].position - this.stops[lowerIndex].position));
        return interpolateByColorSpace(
            scalePosition,
            interpolationMode,
            this.stops[lowerIndex].color,
            this.stops[upperIndex].color
        );
    }
    trim(lowerBound, upperBound, interpolationMode = ColorInterpolationSpace.RGB) {
        if (lowerBound < 0 || upperBound > 1 || upperBound < lowerBound) {
            throw new Error("Invalid bounds");
        }
        if (lowerBound === upperBound) {
            return new ColorScale([
                { color: this.getColor(lowerBound, interpolationMode), position: 0 },
            ]);
        }
        const containedStops = [];
        for (let i = 0; i < this.stops.length; i++) {
            if (
                this.stops[i].position >= lowerBound &&
                this.stops[i].position <= upperBound
            ) {
                containedStops.push(this.stops[i]);
            }
        }
        if (containedStops.length === 0) {
            return new ColorScale([
                { color: this.getColor(lowerBound), position: lowerBound },
                { color: this.getColor(upperBound), position: upperBound },
            ]);
        }
        if (containedStops[0].position !== lowerBound) {
            containedStops.unshift({
                color: this.getColor(lowerBound),
                position: lowerBound,
            });
        }
        if (containedStops[containedStops.length - 1].position !== upperBound) {
            containedStops.push({
                color: this.getColor(upperBound),
                position: upperBound,
            });
        }
        const range = upperBound - lowerBound;
        const finalStops = new Array(containedStops.length);
        for (let i = 0; i < containedStops.length; i++) {
            finalStops[i] = {
                color: containedStops[i].color,
                position: (containedStops[i].position - lowerBound) / range,
            };
        }
        return new ColorScale(finalStops);
    }
    findNextColor(
        position,
        contrast,
        searchDown = false,
        interpolationMode = ColorInterpolationSpace.RGB,
        contrastErrorMargin = 0.005,
        maxSearchIterations = 32
    ) {
        if (isNaN(position) || position <= 0) {
            position = 0;
        } else if (position >= 1) {
            position = 1;
        }
        const startingColor = this.getColor(position, interpolationMode);
        const finalPosition = searchDown ? 0 : 1;
        const finalColor = this.getColor(finalPosition, interpolationMode);
        const finalContrast = contrastRatio(startingColor, finalColor);
        if (finalContrast <= contrast) {
            return finalPosition;
        }
        let testRangeMin = searchDown ? 0 : position;
        let testRangeMax = searchDown ? position : 0;
        let mid = finalPosition;
        let iterations = 0;
        while (iterations <= maxSearchIterations) {
            mid = Math.abs(testRangeMax - testRangeMin) / 2 + testRangeMin;
            const midColor = this.getColor(mid, interpolationMode);
            const midContrast = contrastRatio(startingColor, midColor);
            if (Math.abs(midContrast - contrast) <= contrastErrorMargin) {
                return mid;
            } else if (midContrast > contrast) {
                if (searchDown) {
                    testRangeMin = mid;
                } else {
                    testRangeMax = mid;
                }
            } else {
                if (searchDown) {
                    testRangeMax = mid;
                } else {
                    testRangeMin = mid;
                }
            }
            iterations++;
        }
        return mid;
    }
    clone() {
        const newStops = new Array(this.stops.length);
        for (let i = 0; i < newStops.length; i++) {
            newStops[i] = {
                color: this.stops[i].color,
                position: this.stops[i].position,
            };
        }
        return new ColorScale(newStops);
    }
    sortColorScaleStops(stops) {
        return stops.sort((a, b) => {
            const A = a.position;
            const B = b.position;
            if (A < B) {
                return -1;
            } else if (A > B) {
                return 1;
            } else {
                return 0;
            }
        });
    }
}
