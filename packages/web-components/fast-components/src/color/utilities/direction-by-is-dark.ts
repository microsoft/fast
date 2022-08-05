import { Swatch } from "../swatch.js";
import { isDark } from "./is-dark.js";

/**
 * @internal
 */
export function directionByIsDark(color: Swatch): 1 | -1 {
    return isDark(color) ? -1 : 1;
}
