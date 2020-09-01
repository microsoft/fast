/**
 * Ensures that an input number does not exceed a max value and is not less than a min value.
 * @param i - the number to clamp
 * @param min - the maximum (inclusive) value
 * @param max - the minimum (inclusive) value
 * @public
 */
export function clamp(i: number, min: number, max: number): number {
    if (isNaN(i) || i <= min) {
        return min;
    } else if (i >= max) {
        return max;
    }
    return i;
}

/**
 * Scales an input to a number between 0 and 1
 * @param i - a number between min and max
 * @param min - the max value
 * @param max - the min value
 * @public
 */
export function normalize(i: number, min: number, max: number): number {
    if (isNaN(i) || i <= min) {
        return 0.0;
    } else if (i >= max) {
        return 1.0;
    }
    return i / (max - min);
}

/**
 * Scales a number between 0 and 1
 * @param i - the number to denormalize
 * @param min - the min value
 * @param max - the max value
 * @public
 */
export function denormalize(i: number, min: number, max: number): number {
    if (isNaN(i)) {
        return min;
    }
    return min + i * (max - min);
}

/**
 * Converts degrees to radians.
 * @param i - degrees
 * @public
 */
export function degreesToRadians(i: number): number {
    return i * (Math.PI / 180.0);
}

/**
 * Converts radians to degrees.
 * @param i - radians
 * @public
 */
export function radiansToDegrees(i: number): number {
    return i * (180.0 / Math.PI);
}

/**
 * Converts a number between 0 and 255 to a hex string.
 * @param i - the number to convert to a hex string
 * @public
 */
export function getHexStringForByte(i: number): string {
    const s: string = Math.round(clamp(i, 0.0, 255.0)).toString(16);
    if (s.length === 1) {
        return "0" + s;
    }
    return s;
}

/**
 * Linearly interpolate
 * @public
 */
export function lerp(i: number, min: number, max: number): number {
    if (isNaN(i) || i <= 0.0) {
        return min;
    } else if (i >= 1.0) {
        return max;
    }
    return min + i * (max - min);
}

/**
 * Linearly interpolate angles in degrees
 * @public
 */
export function lerpAnglesInDegrees(i: number, min: number, max: number): number {
    if (i <= 0.0) {
        return min % 360.0;
    } else if (i >= 1.0) {
        return max % 360.0;
    }
    const a: number = (min - max + 360.0) % 360.0;
    const b: number = (max - min + 360.0) % 360.0;
    if (a <= b) {
        return (min - a * i + 360.0) % 360.0;
    }
    return (min + a * i + 360.0) % 360.0;
}

const TwoPI: number = Math.PI * 2;

/**
 * Linearly interpolate angles in radians
 * @public
 */
export function lerpAnglesInRadians(i: number, min: number, max: number): number {
    if (isNaN(i) || i <= 0.0) {
        return min % TwoPI;
    } else if (i >= 1.0) {
        return max % TwoPI;
    }
    const a: number = (min - max + TwoPI) % TwoPI;
    const b: number = (max - min + TwoPI) % TwoPI;
    if (a <= b) {
        return (min - a * i + TwoPI) % TwoPI;
    }
    return (min + a * i + TwoPI) % TwoPI;
}

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
export function roundToPrecisionSmall(i: number, precision: number): number {
    const factor: number = Math.pow(10, precision);
    return Math.round(i * factor) / factor;
}
