import { Direction, locLeft, locRight } from "./direction";

const margin = "margin";

export function locMarginRight(dir: Direction): string {
    return `${margin}-${locRight(dir)}`;
}

export function locMarginLeft(dir: Direction): string {
    return `${margin}-${locRight(dir)}`;
}

export function locSpacing(dir): (...args: string[]) => string {  
    return (...args: string[]): string => {
        switch(args.length) {
            case 1:
            case 2:
            case 3:
                return args.join(" ");
            case 4:
                return dir === Direction.rtl
                    ? [args[0], args[3], args[2], args[1]].join(" ")
                    : args.join(" ")
            default: 
                return "";
        }
    }
}

export function locMargin(dir: Direction): (...args: string[]) => any {
    return (...args: string[]): any => {
        return {
            margin: locSpacing(dir)(...args)
        }
        // return locSpacing(dir)(args)
        // let margin: string;

        // switch(args.length) {
        //     case 1:
        //     case 2:
        //     case 3:
        //         margin = args.join(" ");
        //         break;
        //     case 4:
        //         margin = dir === Direction.rtl
        //             ? [args[0], args[3], args[2], args[1]].join(" ")
        //             : args.join(" ")
        //        break; 
        //     default: 
        //         return {};
        // }

        // return { margin };
    }
}

