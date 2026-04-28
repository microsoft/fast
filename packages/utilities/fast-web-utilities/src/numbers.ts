/**
 * This method keeps a given value within the bounds of a min and max value. If the value
 * is larger than the max, the minimum value will be returned. If the value is smaller than the minimum,
 * the maximum will be returned. Otherwise, the value is returned un-changed.
 */
export function wrapInBounds(min: number, max: number, value: number): number {
    if (value < min) {
        return max;
    } else if (value > max) {
        return min;
    }

    return value;
}

/**
 * Ensures that a value is between a min and max value. If value is lower than min, min will be returned.
 * If value is greater than max, max will be returned.
 */
export function limit(min: number, max: number, value: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Determines if a number value is within a specified range.
 *
 * @param value - the value to check
 * @param min - the range start
 * @param max - the range end
 */
export function inRange(value: number, min: number, max: number = 0): boolean {
    [min, max] = [min, max].sort((a, b) => a - b);
    return min <= value && value < max;
}
