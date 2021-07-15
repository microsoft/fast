/**
 * Adds numbers or functions that accept a design system and return a number.
 * @internal
 */
export declare function add<T>(
    ...args: Array<number | ((designSystem: T) => number)>
): (designSystem?: T) => number;
/**
 * Subtract numbers or functions that accept a design system and return a number.
 * @internal
 */
export declare function subtract<T>(
    ...args: Array<number | ((designSystem: T) => number)>
): (designSystem?: T) => number;
/**
 * Multiplies numbers or functions that accept a design system and return a number.
 * @internal
 */
export declare function multiply<T>(
    ...args: Array<number | ((designSystem: T) => number)>
): (designSystem?: T) => number;
/**
 * Divides numbers or functions that accept a design system and return a number.
 * @internal
 */
export declare function divide<T>(
    ...args: Array<number | ((designSystem: T) => number)>
): (designSystem?: T) => number;
