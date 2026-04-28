import { isFunction } from "../interfaces.js";
import type { Expression } from "../observation/observable.js";
import { Binding } from "./binding.js";
import { oneWay } from "./one-way.js";
import { oneTime } from "./one-time.js";

/**
 * Normalizes the input value into a binding.
 * @param value - The value to create the default binding for.
 * @returns A binding configuration for the provided value.
 * @public
 */
export function normalizeBinding<TSource = any, TReturn = any, TParent = any>(
    value: Expression<TSource, TReturn, TParent> | Binding<TSource, TReturn, TParent> | {}
): Binding<TSource, TReturn, TParent> {
    return isFunction(value)
        ? oneWay(value)
        : value instanceof Binding
        ? value
        : oneTime(() => value);
}
