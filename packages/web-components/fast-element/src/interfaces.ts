/**
 * Represents a callable type such as a function or an object with a "call" method.
 */
export type Callable = typeof Function.prototype.call | { call(): void };

/**
 * Reverses all readonly members, making them mutable.
 */
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

/**
 * A readonly, empty array.
 * @remarks
 * Typically returned by APIs that return arrays when there are
 * no actual items to return.
 */
export const emptyArray = Object.freeze([]);
