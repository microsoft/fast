import { Direction } from "./direction";

/**
 * Localizes top/left/bottom/right formatted arguments, such as the format used by CSS's padding and margin
 * properties.
 * eg. when dir is RTL, "2px 3px 4px 5px" -> "2px 5px 4px 3px"
 */
export function locSpacing(dir: Direction): (value: string) => string {
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
