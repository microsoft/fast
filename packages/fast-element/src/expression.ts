/**
 * Provides additional contextual information available to arrow functions
 * evaluated in the context of a template update.
 */
export interface ExpressionContext {
    event: Event;
}

/**
 * A simple abstraction of an expression which can be evaluated as part of
 * a template update.
 */
export interface Expression {
    evaluate(scope: unknown, context?: ExpressionContext): unknown;
}

/**
 * The signature of an arrow function capable of being evluated as part of a template update.
 */
export type Getter<T = any, K = any> = (model: T, context: ExpressionContext) => K;

/**
 * A basic implementation of Expression, which wraps a Getter function.
 */
export class AccessScopeExpression<T = any, K = any> implements Expression {
    constructor(public getter: Getter<T, K>) {}

    public static from<T = any, K = any>(expression: Getter<T, K> | string) {
        if (typeof expression === "string") {
            return new AccessScopeExpression<T, K>(x => (x as any)[expression]);
        }

        return new AccessScopeExpression(expression);
    }

    public evaluate(model: unknown, context?: ExpressionContext) {
        return this.getter(model as T, context!);
    }
}

/**
 * An implementation of Expression which interpolates string literal values with
 * Getter functions to produce a final string.
 */
export class InterpolationExpression implements Expression {
    constructor(private parts: (string | Getter)[]) {}

    public evaluate(scope: unknown, context?: ExpressionContext) {
        return this.parts
            .map(x => (typeof x === "string" ? x : x(scope, context!)))
            .join("");
    }
}
