import { isFunction, isString } from "lodash-es";
export function classNames(...args) {
    return args.reduce((accum, value) => {
        const leadingChar = accum.length ? " " : "";
        const normalizedValue =
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
