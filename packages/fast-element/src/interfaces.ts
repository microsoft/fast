export type Callable = typeof Function.prototype.call | { call(): void };

export const emptyArray = Object.freeze([]);

export type CustomElementConstructor = {
    new (): HTMLElement;
};

/**
 * Provides additional contextual information available to arrow functions
 * evaluated in the context of a template update.
 */
export interface ExpressionContext {
    event: Event;
}

/**
 * The signature of an arrow function capable of being evluated as part of a template update.
 */
export type Expression<T = any, K = any> = (scope: T, context: ExpressionContext) => K;
