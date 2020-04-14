import { isFunction, isString } from "lodash-es";

type ClassNamesArg = string | (() => string) | [string | (() => string), boolean];

export function classNames(...args: ClassNamesArg[]): string {
    return args.reduce<string>((accum: string, value: ClassNamesArg): string => {
        const leadingChar: string = accum.length ? " " : "";
        const normalizedValue: string =
            Array.isArray(value) && value[1]
                ? classNames.call(null, value[0])
                : isFunction(value)
                ? value()
                : isString(value)
                ? value
                : "";

        return !normalizedValue.length ? accum : accum + leadingChar + normalizedValue;
    }, "");
}
