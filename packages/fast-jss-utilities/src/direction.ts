export enum Direction {
    ltr = "ltr",
    rtl = "rtl"
};

const left: string = "left";
const right: string = "right";

export function locLeft(dir: Direction): string {
    return dir === Direction.rtl ? right : left;
}

export function locRight(dir: Direction): string {
    return dir === Direction.rtl ? left : right;
}
