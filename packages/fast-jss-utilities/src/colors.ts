import { contrast, ensureContrast } from "@microsoft/fast-colors";
import { memoize } from "lodash-es";

/**
 * Hashing function for contrast memoization
 */
function resolveContrastArgs(...args: (string | number) []): string {
    return args.join("");
}

const memoizedContrast = memoize(contrast, resolveContrastArgs);
const memoizedEnsureContrast = memoize(ensureContrast, resolveContrastArgs)

export { memoizedContrast as contrast };
export { memoizedEnsureContrast as ensureContrast };
