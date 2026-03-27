/** The prefix used to reference the execution context in expressions. */
export const contextAccessorPrefix = "$c.";

/**
 * Builds a property accessor function for the given dot-notation expression.
 *
 * Resolution rules:
 * - `$c.parent.prop` — resolves against the execution context object `c`.
 * - Inside a repeat (non-null `context`):
 *   - If the first path segment matches the loop variable, resolves against `x` (the item).
 *   - Otherwise resolves against `c.parent` (the host element).
 * - Outside a repeat, resolves against `x` (the component source).
 *
 * @param expression - A dot-notation property path, e.g. `'user.name'` or `'$c.parent.title'`.
 * @param context - The current repeat loop variable name, or `null` outside a repeat.
 * @public
 */
export function makeAccessor(
    expression: string,
    context: string | null
): (x: any, c: any) => any {
    if (expression.startsWith(contextAccessorPrefix)) {
        const path = expression.slice(contextAccessorPrefix.length).split(".");
        return (_x: any, c: any) =>
            path.reduce((obj: any, key: string) => obj?.[key], c);
    }

    const parts = expression.split(".");

    if (context !== null) {
        if (parts[0] === context) {
            if (parts.length === 1) {
                return (x: any) => x;
            }
            const subPath = parts.slice(1);
            return (x: any) =>
                subPath.reduce((obj: any, key: string) => obj?.[key], x);
        }
        return (_x: any, c: any) =>
            parts.reduce((obj: any, key: string) => obj?.[key], c.parent);
    }

    return (x: any) => parts.reduce((obj: any, key: string) => obj?.[key], x);
}

/**
 * Resolves a comparison operand string to either a literal value or a
 * property accessor function.
 *
 * - Quoted strings (`'foo'`, `"foo"`) → unwrapped string literal.
 * - `true` / `false` → boolean literal.
 * - Numeric strings → number literal.
 * - Anything else → a property accessor built with {@link makeAccessor}.
 *
 * @param operand - The right-hand side of a comparison expression.
 * @param context - The current repeat loop variable name, or `null` outside a repeat.
 * @public
 */
export function resolveOperand(
    operand: string,
    context: string | null
): any | ((x: any, c: any) => any) {
    const unquoted = operand.replace(/^['"]|['"]$/g, "");
    if (unquoted !== operand) return unquoted;
    if (operand === "true") return true;
    if (operand === "false") return false;
    const num = Number(operand);
    if (!isNaN(num)) return num;
    return makeAccessor(operand, context);
}

/**
 * Builds a boolean accessor for use in `when` directives and `?boolean` attribute bindings.
 *
 * Supported expression forms (evaluated left-to-right with standard precedence):
 * - Simple property: `'show'` → `!!x.show`
 * - Negation: `'!show'` → `!x.show`
 * - Comparison: `'count > 0'`, `'status == "active"'`, `'count != 0'`
 * - Logical OR: `'a || b'`
 * - Logical AND: `'a && b'`
 * - Context access: `'$c.parent.show'`
 *
 * @param expression - The boolean expression string.
 * @param context - The current repeat loop variable name, or `null` outside a repeat.
 * @public
 */
export function makeBooleanAccessor(
    expression: string,
    context: string | null
): (x: any, c: any) => boolean {
    const trimmed = expression.trim();

    const orParts = trimmed.split(/\s*\|\|\s*/);
    if (orParts.length > 1) {
        const accessors = orParts.map(p => makeBooleanAccessor(p, context));
        return (x: any, c: any) => accessors.some(fn => fn(x, c));
    }

    const andParts = trimmed.split(/\s*&&\s*/);
    if (andParts.length > 1) {
        const accessors = andParts.map(p => makeBooleanAccessor(p, context));
        return (x: any, c: any) => accessors.every(fn => fn(x, c));
    }

    if (trimmed.startsWith("!")) {
        const inner = makeAccessor(trimmed.slice(1), context);
        return (x: any, c: any) => !inner(x, c);
    }

    const comparisonMatch = trimmed.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
    if (comparisonMatch) {
        const [, rawLeft, operator, rawRight] = comparisonMatch;
        const leftAccessor = makeAccessor(rawLeft.trim(), context);
        const rightResolved = resolveOperand(rawRight.trim(), context);

        return (x: any, c: any) => {
            const left = leftAccessor(x, c);
            const right =
                typeof rightResolved === "function" ? rightResolved(x, c) : rightResolved;
            switch (operator) {
                // biome-ignore lint/suspicious/noDoubleEquals: matches existing FAST behaviour
                case "==":
                    return left == right;
                // biome-ignore lint/suspicious/noDoubleEquals: matches existing FAST behaviour
                case "!=":
                    return left != right;
                case ">":
                    return left > right;
                case ">=":
                    return left >= right;
                case "<":
                    return left < right;
                case "<=":
                    return left <= right;
                default:
                    return !!left;
            }
        };
    }

    const accessor = makeAccessor(trimmed, context);
    return (x: any, c: any) => {
        const value = accessor(x, c);
        if (typeof value === "boolean") return value;
        if (typeof value === "number") return value !== 0;
        if (typeof value === "string") return value.length > 0;
        return !!value;
    };
}

/**
 * Builds an event handler function suitable for use in `@event` attribute bindings.
 *
 * The handler resolves the named method on the source (or execution context for
 * `$c.`-prefixed paths), binds it to its owner, and invokes it with the
 * appropriate argument:
 * - `'e'` → passes the DOM event (`c.event`).
 * - A property name → passes the resolved property value.
 * - Empty / omitted → no argument.
 *
 * @param handler - Method name or `$c.`-prefixed context path, e.g. `'handleClick'`.
 * @param argument - Optional argument descriptor (`'e'`, a property name, or `''`).
 * @param context - The current repeat loop variable name, or `null` outside a repeat.
 * @public
 */
export function makeEventHandler(
    handler: string,
    argument: string,
    context: string | null
): (x: any, c: any) => any {
    const isContextPath = handler.startsWith(contextAccessorPrefix);

    return (x: any, c: any) => {
        let owner: any;
        let method: any;

        if (isContextPath) {
            const parts = handler.slice(contextAccessorPrefix.length).split(".");
            const methodName = parts[parts.length - 1];
            const ownerPath = parts.slice(0, -1);
            owner = ownerPath.reduce((obj: any, key: string) => obj?.[key], c);
            method = owner?.[methodName];
        } else {
            owner = x;
            method = x[handler];
        }

        if (typeof method !== "function") return;

        const boundMethod = method.bind(owner);

        if (argument === "e") {
            return boundMethod(c.event);
        } else if (argument) {
            const argAccessor = makeAccessor(argument, context);
            return boundMethod(argAccessor(x, c));
        }

        return boundMethod();
    };
}
