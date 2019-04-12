export type MathUtilityArgumentList<T> = Array<number | ((designSystem: T) => number)>;
export type MathUtilityFunction<T> = (
    ...args: MathUtilityArgumentList<T>
) => (designSystem?: T) => number;

function performOperation<T>(
    opperation: (a: number, b: number) => number
): MathUtilityFunction<T> {
    return (...args: MathUtilityArgumentList<T>): ((designSystem?: T) => number) => {
        return (designSystem?: T): number => {
            const firstArg: number | ((designSystem: T) => number) = args[0];
            let value: number =
                typeof firstArg === "function" ? firstArg(designSystem) : firstArg;

            for (let i: number = 1; i < args.length; i++) {
                const currentValue: number | ((designSystem: T) => number) = args[i];
                value = opperation(
                    value,
                    typeof currentValue === "function"
                        ? currentValue(designSystem)
                        : currentValue
                );
            }

            return value;
        };
    };
}

const _add: MathUtilityFunction<unknown> = performOperation(
    (a: number, b: number): number => a + b
);
const _subtract: MathUtilityFunction<unknown> = performOperation(
    (a: number, b: number): number => a - b
);
const _multiply: MathUtilityFunction<unknown> = performOperation(
    (a: number, b: number): number => a * b
);
const _divide: MathUtilityFunction<unknown> = performOperation(
    (a: number, b: number): number => a / b
);
/**
 * Adds numbers or functions that accept a design system and return a number.
 */
export function add<T>(
    ...args: MathUtilityArgumentList<T>
): (designSystem?: T) => number {
    return _add.apply(this, args);
}

/**
 * Subtract numbers or functions that accept a design system and return a number.
 */
export function subtract<T>(
    ...args: MathUtilityArgumentList<T>
): (designSystem?: T) => number {
    return _subtract.apply(this, args);
}

/**
 * Multiplies numbers or functions that accept a design system and return a number.
 */
export function multiply<T>(
    ...args: MathUtilityArgumentList<T>
): (designSystem?: T) => number {
    return _multiply.apply(this, args);
}

/**
 * Divides numbers or functions that accept a design system and return a number.
 */
export function divide<T>(
    ...args: MathUtilityArgumentList<T>
): (designSystem?: T) => number {
    return _divide.apply(this, args);
}
