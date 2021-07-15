/**
 * Represents a callable type such as a function or an object with a "call" method.
 * @public
 */
export declare type Callable =
    | typeof Function.prototype.call
    | {
          call(): void;
      };
/**
 * Allows for the creation of Constructable mixin classes.
 *
 * @public
 */
export declare type Constructable<T = {}> = {
    new (...args: any[]): T;
};
/**
 * Reverses all readonly members, making them mutable.
 * @internal
 */
export declare type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
