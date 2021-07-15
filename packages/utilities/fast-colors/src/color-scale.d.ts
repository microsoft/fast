import { ColorInterpolationSpace } from "./color-interpolation";
import { ColorRGBA64 } from "./color-rgba-64";
/**
 * @public
 */
export interface ColorScaleStop {
    color: ColorRGBA64;
    position: number;
}
/**
 * A color scale created from linear stops
 * @public
 */
export declare class ColorScale {
    static createBalancedColorScale(colors: ColorRGBA64[]): ColorScale;
    constructor(stops: ColorScaleStop[]);
    private readonly stops;
    getColor(position: number, interpolationMode?: ColorInterpolationSpace): ColorRGBA64;
    trim(
        lowerBound: number,
        upperBound: number,
        interpolationMode?: ColorInterpolationSpace
    ): ColorScale;
    findNextColor(
        position: number,
        contrast: number,
        searchDown?: boolean,
        interpolationMode?: ColorInterpolationSpace,
        contrastErrorMargin?: number,
        maxSearchIterations?: number
    ): number;
    clone(): ColorScale;
    private sortColorScaleStops;
}
