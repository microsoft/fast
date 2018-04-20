export enum Direction {
    ltr = "ltr",
    rtl = "rtl"
};

const left: string = "left";
const right: string = "right";

/**
 * Returns "right" when dir is "rtl", otherwise returns "left"
 */
export function locLeft(dir: Direction): string {
    return dir === Direction.rtl ? right : left;
}

/**
 * returns "left" when dir is "rtl", otherwise returns "right"
 */
export function locRight(dir: Direction): string {
    return dir === Direction.rtl ? left : right;
}
