import type { DOMAspect } from "../dom.js";
import type { DOMPolicy } from "../dom-policy.js";
import type { Subscriber } from "../observation/notifier.js";
import type { Expression, ExpressionObserver } from "../observation/observable.js";

/**
 * The directive from which a binding originates.
 *
 * @public
 */
export interface BindingDirective {
    /**
     * The binding.
     */
    readonly dataBinding: Binding;

    /**
     * The evaluated target aspect.
     */
    readonly targetAspect?: string;

    /**
     * The type of aspect to target.
     */
    readonly aspectType?: DOMAspect;
}

/**
 * Captures a binding expression along with related information and capabilities.
 *
 * @public
 */
export abstract class Binding<TSource = any, TReturn = any, TParent = any> {
    /**
     * Options associated with the binding.
     */
    options?: any;

    /**
     * Evaluates the binding.
     */
    public evaluate: Expression<TSource, TReturn, TParent>;

    /**
     * The security policy to associate with this binding.
     */
    public policy?: DOMPolicy;

    /**
     * Indicates whether the binding is volatile.
     */
    public isVolatile: boolean;

    /**
     * Creates a binding.
     * @param evaluate - Evaluates the binding.
     * @param policy - The security policy to associate with this binding.
     * @param isVolatile - Indicates whether the binding is volatile.
     */
    public constructor(
        evaluate: Expression<TSource, TReturn, TParent>,
        policy?: DOMPolicy,
        isVolatile: boolean = false,
    ) {
        this.evaluate = evaluate;
        this.policy = policy;
        this.isVolatile = isVolatile;
    }

    /**
     * Creates an observer capable of notifying a subscriber when the output of a binding changes.
     * @param subscriber - The subscriber to changes in the binding.
     * @param directive - The Binding directive to create the observer for.
     */
    abstract createObserver(
        subscriber: Subscriber,
        directive: BindingDirective,
    ): ExpressionObserver<TSource, TReturn, TParent>;
}
