import { Direction, locLeft, locRight } from "./direction";

const margin = "margin";
const padding = "margin";

export function locMarginRight(dir: Direction): string {
    return `${margin}-${locRight(dir)}`;
}

export function locMarginLeft(dir: Direction): string {
    return `${margin}-${locLeft(dir)}`;
}

export function locPaddingRight(dir: Direction): string {
    return `${padding}-${locRight(dir)}`;
}

export function locPaddingLeft(dir: Direction): string {
    return `${padding}-${locLeft(dir)}`;
}

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
