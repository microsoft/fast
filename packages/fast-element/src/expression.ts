/**
 * Provides additional contextual information available to arrow functions
 * evaluated in the context of a template update.
 */
export interface IEvaluationContext<T = any> {
    event: Event;
    parent: T;
    index: number;
}

/**
 * A simple abstraction of an expression which can be evaluated as part of
 * a template update.
 */
export interface IExpression {
    evaluate(scope: unknown, context?: IEvaluationContext): unknown;
}

/**
 * The signature of an arrow function capable of being evluated as part of a template update.
 */
export type Getter<T = any, K = any> = (model: T, context: IEvaluationContext) => K;

/**
 * A basic implementation of IExpression, which wraps a Getter function.
 */
export class AccessScopeExpression<T = any, K = any> implements IExpression {
    constructor(public getter: Getter<T, K>) {}

    public static from<T = any, K = any>(expression: Getter<T, K> | string) {
        if (typeof expression === "string") {
            return new AccessScopeExpression<T, K>(x => (x as any)[expression]);
        }

        return new AccessScopeExpression(expression);
    }

    public evaluate(model: unknown, context?: IEvaluationContext) {
        return this.getter(model as T, context!);
    }
}

/**
 * An implementation of IExpression which interpolates string literal values with
 * Getter functions to produce a final string.
 */
export class InterpolationExpression implements IExpression {
    constructor(private parts: (string | Getter)[]) {}

    public evaluate(scope: unknown, context?: IEvaluationContext) {
        return this.parts
            .map(x => (typeof x === "string" ? x : x(scope, context!)))
            .join("");
    }
}
