import { memoize, merge } from "lodash-es";
import { mergeDesignSystem } from "@microsoft/fast-jss-manager";

/**
 * Ensure that all properties of a given object are assigned values
 */
export function withDefaults<T>(defaults: T): (config: Partial<T>) => T {
    return memoize((config: T): T => mergeDesignSystem(defaults, config));
}
