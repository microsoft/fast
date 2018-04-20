import { Direction, locLeft, locRight } from "./direction";

const margin = "margin";
const padding = "padding";

/**
 * Returns "margin-left" when dir is "rtl", otherwise returns "margin-right"
 */
export function locMarginRight(dir: Direction): string {
    return `${margin}-${locRight(dir)}`;
}

/**
 * Returns "margin-right" when dir is "rtl", otherwise returns "margin-left"
 */
export function locMarginLeft(dir: Direction): string {
    return `${margin}-${locLeft(dir)}`;
}

/**
 * Returns "padding-left" when dir is "rtl", otherwise returns "margin-right"
 */
export function locPaddingRight(dir: Direction): string {
    return `${padding}-${locRight(dir)}`;
}

/**
 * Returns "padding-right" when dir is "rtl", otherwise returns "margin-left"
 */
export function locPaddingLeft(dir: Direction): string {
    return `${padding}-${locLeft(dir)}`;
}

/**
 * Localizes top/left/bottom/right formatted arguments, such as the format used by CSS's padding and margin
 * properties. 
 */
export function locSpacing(dir): (...args: string[]) => string {  
    let space = " ";
    return (...args: string[]): string => {
        switch(args.length) {
            case 1:
            case 2:
            case 3:
                return args.join(space);
            case 4:
                return dir === Direction.rtl
                    ? [args[0], args[3], args[2], args[1]].join(space)
                    : args.join(space)
            default: 
                return "";
        }
    }
}
