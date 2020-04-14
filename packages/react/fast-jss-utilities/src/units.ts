import { isFunction } from "lodash-es";

export function toUnit(unit: string = "px"): (value: number) => string {
    return (value: number): string => value + unit;
}

const withPx: (value: number) => string = toUnit();
export function toPx<T>(func: (designSystem: T) => number): (designSystem: T) => string;
export function toPx(item: number): string;
export function toPx<T>(arg: any): any {
    return isFunction(arg)
        ? (designSystem: T): string => {
              return withPx(arg(designSystem) as number);
          }
        : withPx(arg);
}
