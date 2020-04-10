/**
 * Expose ltr and rtl strings
 */
export enum Direction {
    ltr = "ltr",
    rtl = "rtl",
}

/**
 * Localizes top/left/bottom/right formatted arguments, such as the format used by CSS's padding and margin
 * properties.
 * eg. when dir is RTL, "2px 3px 4px 5px" -> "2px 5px 4px 3px"
 */
export function localizeSpacing(dir: Direction): (value: string) => string {
    return (value: string): string => {
        if (typeof value !== "string") {
            return "";
        }

        const space: string = " ";
        const split: string[] = value.split(space);

        return split.length !== 4
            ? value
            : dir === Direction.rtl
            ? [split[0], split[3], split[2], split[1]].join(space)
            : value;
    };
}

/**
 * Returns a css property based on a given direction value
 */
export function applyLocalizedProperty(
    ltrProperty: string,
    rtlProperty: string,
    dir: Direction
): string {
    return dir === Direction.ltr ? ltrProperty : rtlProperty;
}

/**
 * Utility for returning one of two values, where the predicate is the
 * direction property on the design-system. If provided values are functions,
 * the function will return the return value of the function invoked with
 * the design system
 */
export function directionSwitch<T extends { direction: Direction }, S>(
    ltr: S | ((designSystem: T) => S),
    rtl: S | ((designSystem: T) => S)
): (designSystem: T) => S {
    return (designSystem: T): S => {
        const dir: Direction =
            designSystem && designSystem.direction
                ? designSystem.direction
                : Direction.ltr;
        const value: S | ((designSystem: T) => S) = dir === Direction.rtl ? rtl : ltr;

        return typeof value === "function"
            ? (value as (designSystem: T) => S)(designSystem)
            : value;
    };
}
