import { memoize, merge } from "lodash-es";

/**
 * Ensure that all properties of a given object are assigned values
 */
export function withDefaults<T>(defaults: T): (config: Partial<T>) => T {
    return memoize((config: Partial<T>): T => merge({}, defaults, config));
}
