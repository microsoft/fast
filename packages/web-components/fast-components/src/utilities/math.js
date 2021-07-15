function performOperation(operation) {
    return (...args) => {
        return designSystem => {
            const firstArg = args[0];
            let value =
                typeof firstArg === "function" ? firstArg(designSystem) : firstArg;
            for (let i = 1; i < args.length; i++) {
                const currentValue = args[i];
                value = operation(
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
const _add = performOperation((a, b) => a + b);
const _subtract = performOperation((a, b) => a - b);
const _multiply = performOperation((a, b) => a * b);
const _divide = performOperation((a, b) => a / b);
/**
 * Adds numbers or functions that accept a design system and return a number.
 * @internal
 */
export function add(...args) {
    return _add.apply(this, args);
}
/**
 * Subtract numbers or functions that accept a design system and return a number.
 * @internal
 */
export function subtract(...args) {
    return _subtract.apply(this, args);
}
/**
 * Multiplies numbers or functions that accept a design system and return a number.
 * @internal
 */
export function multiply(...args) {
    return _multiply.apply(this, args);
}
/**
 * Divides numbers or functions that accept a design system and return a number.
 * @internal
 */
export function divide(...args) {
    return _divide.apply(this, args);
}
