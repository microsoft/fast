import { isDark } from "./is-dark";
/**
 * @internal
 */
export function directionByIsDark(color) {
    return isDark(color) ? -1 : 1;
}
