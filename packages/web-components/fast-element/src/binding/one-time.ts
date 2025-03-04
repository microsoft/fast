import type { DOMPolicy } from "../dom.js";
import type {
    Expression,
    ExpressionController,
    ExpressionObserver,
} from "../observation/observable.js";
import { makeSerializationNoop } from "../platform.js";
import { Binding } from "./binding.js";

class OneTimeBinding<TSource = any, TReturn = any, TParent = any>
    extends Binding<TSource, TReturn, TParent>
    implements ExpressionObserver<TSource, TReturn, TParent>
{
    createObserver(): ExpressionObserver<TSource, TReturn, TParent> {
        return this;
    }

    bind(controller: ExpressionController): TReturn {
        return this.evaluate(controller.source, controller.context);
    }
}

makeSerializationNoop(OneTimeBinding);

/**
 * Creates a one time binding
 * @param expression - The binding to refresh when signaled.
 * @param policy - The security policy to associate with th binding.
 * @returns A binding configuration.
 * @public
 */
export function oneTime<T = any>(
    expression: Expression<T>,
    policy?: DOMPolicy
): Binding<T> {
    return new OneTimeBinding(expression, policy);
}
