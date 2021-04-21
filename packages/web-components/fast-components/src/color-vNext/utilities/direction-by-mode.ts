import { Swatch } from "../swatch";
import { isDarkMode } from "./is-dark-mode";

/**
 * @internal
 */
export function directionByMode(color: Swatch): 1 | -1 {
    return isDarkMode(color) ? -1 : 1;
}
