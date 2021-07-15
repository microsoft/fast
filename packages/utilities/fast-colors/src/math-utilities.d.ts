/**
 * Ensures that an input number does not exceed a max value and is not less than a min value.
 * @param i - the number to clamp
 * @param min - the maximum (inclusive) value
 * @param max - the minimum (inclusive) value
 * @public
 */
export declare function clamp(i: number, min: number, max: number): number;
/**
 * Scales an input to a number between 0 and 1
 * @param i - a number between min and max
 * @param min - the max value
 * @param max - the min value
 * @public
 */
export declare function normalize(i: number, min: number, max: number): number;
/**
 * Scales a number between 0 and 1
 * @param i - the number to denormalize
 * @param min - the min value
 * @param max - the max value
 * @public
 */
export declare function denormalize(i: number, min: number, max: number): number;
/**
 * Converts degrees to radians.
 * @param i - degrees
 * @public
 */
export declare function degreesToRadians(i: number): number;
/**
 * Converts radians to degrees.
 * @param i - radians
 * @public
 */
export declare function radiansToDegrees(i: number): number;
/**
 * Converts a number between 0 and 255 to a hex string.
 * @param i - the number to convert to a hex string
 * @public
 */
export declare function getHexStringForByte(i: number): string;
/**
 * Linearly interpolate
 * @public
 */
export declare function lerp(i: number, min: number, max: number): number;
/**
 * Linearly interpolate angles in degrees
 * @public
 */
export declare function lerpAnglesInDegrees(i: number, min: number, max: number): number;
/**
 * Linearly interpolate angles in radians
 * @public
 */
export declare function lerpAnglesInRadians(i: number, min: number, max: number): number;
/**
 *
 * Will return infinity if i*10^(precision) overflows number
 * note that floating point rounding rules come into play here
 * so values that end up rounding on a .5 round to the nearest
 * even not always up so 2.5 rounds to 2
 * @param i - the number to round
 * @param precision - the precision to round to
 *
 * @public
 */
export declare function roundToPrecisionSmall(i: number, precision: number): number;
