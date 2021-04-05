import type { ExecutionContext } from "./observable";

/**
 * Represents and object that can contribute behavior to a view or
 * element's bind/unbind operations.
 * @public
 */
export interface Behavior {
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source: unknown, context: ExecutionContext): void;

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    unbind(source: unknown): void;
}
