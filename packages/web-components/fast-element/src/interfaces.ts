/**
 * Represents a callable type such as a function or an object with a "call" method.
 * @public
 */
export type Callable = typeof Function.prototype.call | { call(): void };

/**
 * Allows for the creation of Constructable mixin classes.
 *
 * @public
 */
export type Constructable<T = {}> = {
    new (...args: any[]): T;
};

/**
 * Reverses all readonly members, making them mutable.
 * @internal
 */
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

/**
 * @internal
 */
export const isFunction = (object: any): object is Function =>
    typeof object === "function";

/**
 * @internal
 */
export const isString = (object: any): object is string => typeof object === "string";
