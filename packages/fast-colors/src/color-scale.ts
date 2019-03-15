// tslint:disable:member-ordering
// tslint:disable:prefer-for-of

import { contrastRatio } from "./color-converters";
import { ColorInterpolationSpace, interpolateByColorSpace } from "./color-interpolation";
import { ColorRGBA64 } from "./color-rgba-64";

export interface ColorScaleStop {
    color: ColorRGBA64;
    position: number;
}

export class ColorScale {
    public static createBalancedColorScale(colors: ColorRGBA64[]): ColorScale {
        if (colors == null || colors.length === 0) {
            throw new Error("The colors argument must be non-empty");
        }

        const stops: ColorScaleStop[] = new Array(colors.length);
        for (let i: number = 0; i < colors.length; i++) {
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

    constructor(stops: ColorScaleStop[]) {
        if (stops == null || stops.length === 0) {
            throw new Error("The stops argument must be non-empty");
        } else {
            this.stops = stops;
        }
    }

    private readonly stops: ColorScaleStop[];

    public getColor(
        position: number,
        interpolationMode: ColorInterpolationSpace = ColorInterpolationSpace.RGB
    ): ColorRGBA64 {
        if (this.stops.length === 1) {
            return this.stops[0].color;
        } else if (position <= 0) {
            return this.stops[0].color;
        } else if (position >= 1) {
            return this.stops[this.stops.length - 1].color;
        }

        let lowerIndex: number = 0;
        for (let i: number = 0; i < this.stops.length; i++) {
            if (this.stops[i].position <= position) {
                lowerIndex = i;
            }
        }
        let upperIndex: number = lowerIndex + 1;
        if (upperIndex >= this.stops.length) {
            upperIndex = this.stops.length - 1;
        }

        const scalePosition: number =
            (position - this.stops[lowerIndex].position) *
            (1.0 / (this.stops[upperIndex].position - this.stops[lowerIndex].position));

        return interpolateByColorSpace(
            scalePosition,
            interpolationMode,
            this.stops[lowerIndex].color,
            this.stops[upperIndex].color
        );
    }

    public trim(
        lowerBound: number,
        upperBound: number,
        interpolationMode: ColorInterpolationSpace = ColorInterpolationSpace.RGB
    ): ColorScale {
        if (lowerBound < 0 || upperBound > 1 || upperBound < lowerBound) {
            throw new Error("Invalid bounds");
        }
        if (lowerBound === upperBound) {
            return new ColorScale([
                { color: this.getColor(lowerBound, interpolationMode), position: 0 },
            ]);
        }

        const containedStops: ColorScaleStop[] = [];

        for (let i: number = 0; i < this.stops.length; i++) {
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

        const range: number = upperBound - lowerBound;
        const finalStops: ColorScaleStop[] = new Array(containedStops.length);
        for (let i: number = 0; i < containedStops.length; i++) {
            finalStops[i] = {
                color: containedStops[i].color,
                position: (containedStops[i].position - lowerBound) / range,
            };
        }

        return new ColorScale(finalStops);
    }

    public findNextColor(
        position: number,
        contrast: number,
        searchDown: boolean = false,
        interpolationMode: ColorInterpolationSpace = ColorInterpolationSpace.RGB,
        contrastErrorMargin: number = 0.005,
        maxSearchIterations: number = 32
    ): number {
        if (isNaN(position) || position <= 0) {
            position = 0;
        } else if (position >= 1) {
            position = 1;
        }
        const startingColor: ColorRGBA64 = this.getColor(position, interpolationMode);
        const finalPosition: number = searchDown ? 0 : 1;
        const finalColor: ColorRGBA64 = this.getColor(finalPosition, interpolationMode);
        const finalContrast: number = contrastRatio(startingColor, finalColor);
        if (finalContrast <= contrast) {
            return finalPosition;
        }

        let testRangeMin: number = searchDown ? 0 : position;
        let testRangeMax: number = searchDown ? position : 0;
        let mid: number = finalPosition;
        let iterations: number = 0;

        while (iterations <= maxSearchIterations) {
            mid = Math.abs(testRangeMax - testRangeMin) / 2 + testRangeMin;
            const midColor: ColorRGBA64 = this.getColor(mid, interpolationMode);
            const midContrast: number = contrastRatio(startingColor, midColor);

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

    public clone(): ColorScale {
        const newStops: ColorScaleStop[] = new Array(this.stops.length);
        for (let i: number = 0; i < newStops.length; i++) {
            newStops[i] = {
                color: this.stops[i].color,
                position: this.stops[i].position,
            };
        }
        return new ColorScale(newStops);
    }
}
