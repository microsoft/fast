import type { DOMPolicy } from "../dom.js";
import type { Subscriber } from "../observation/notifier.js";
import { Expression, ExpressionObserver, Observable } from "../observation/observable.js";
import { Binding } from "./binding.js";

class OneWayBinding<TSource = any, TReturn = any, TParent = any> extends Binding<
    TSource,
    TReturn,
    TParent
> {
    createObserver(
        subscriber: Subscriber
    ): ExpressionObserver<TSource, TReturn, TParent> {
        return Observable.binding(this.evaluate, subscriber, this.isVolatile);
    }
}

/**
 * Creates an standard binding.
 * @param expression - The binding to refresh when changed.
 * @param policy - The security policy to associate with th binding.
 * @param isVolatile - Indicates whether the binding is volatile or not.
 * @returns A binding configuration.
 * @public
 */
export function oneWay<T = any>(
    expression: Expression<T>,
    policy?: DOMPolicy,
    isVolatile = Observable.isVolatileBinding(expression)
): Binding<T> {
    return new OneWayBinding(expression, policy, isVolatile);
}

/**
 * Creates an event listener binding.
 * @param expression - The binding to invoke when the event is raised.
 * @param options - Event listener options.
 * @returns A binding configuration.
 * @public
 */
export function listener<T = any>(
    expression: Expression<T>,
    options?: AddEventListenerOptions
): Binding<T> {
    const config = new OneWayBinding(expression);
    config.options = options;
    return config;
}
