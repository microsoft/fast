/**
 * This method keeps a given value within the bounds of a min and max value. If the value
 * is larger than the max, the minimum value will be returned. If the value is smaller than the minimum,
 * the maximum will be returned. Otherwise, the value is returned un-changed.
 */
export declare function wrapInBounds(min: number, max: number, value: number): number;
/**
 * Ensures that a value is between a min and max value. If value is lower than min, min will be returned.
 * If value is greater than max, max will be retured.
 */
export declare function limit(min: number, max: number, value: number): number;
