import { isFunction, isString } from "lodash-es";

type ClassNamesArg = string | (() => string) | [string | (() => string), boolean];

export function classNames(...args: ClassNamesArg[]): string {
    let classes: string = "";
    let leadingChar: string = "";
    const addLeadingChar: (value: string) => string = (value: string): string =>
        (leadingChar += value);

    for (let i: number = 0, length: number = args.length; i < length; i++) {
        const arg: ClassNamesArg = args[i];
        leadingChar = classes.length === 0 ? "" : " ";

        if (isString(arg)) {
            classes += addLeadingChar(arg);
        } else if (isFunction(arg)) {
            classes += addLeadingChar(arg());
        } else if (Array.isArray(arg) && arg[1]) {
            const value: string | (() => string) = arg[0];

            if (isString(value)) {
                classes += addLeadingChar(value);
            } else if (isFunction(value)) {
                classes += addLeadingChar(value());
            }
        }
    }

    return classes;
}
