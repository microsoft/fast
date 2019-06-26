/**
 * A utility to recursively inspect a JavaScript object and return an object of the
 * same structure that enumerates the HTML input type to configure that piece of data.
 */

/**
 * The type of inputs the parser currently supports
 */
export enum InputTypes {
    checkbox,
    text,
    number,
}

export interface Options {
    /**
     * An array of data-paths to exclude
     * eg. "root.someDataObject"
     */
    exclude?: string[];

    /**
     * An array of data-paths to include. If this option is provided, exclude paths will be ignored
     */
    include?: string[];
}

type ConvertAbleTypes = string | number | boolean;

interface ConvertableData {
    [key: string]: ConvertAbleTypes | ConvertableData;
}

export type ConvertedData<T> = {
    [P in keyof T]: T[P] extends ConvertAbleTypes ? InputTypes : ConvertedData<T[P]>
};

function isString(value: ConvertAbleTypes): value is string {
    return typeof value === "string";
}

function isNumber(value: ConvertAbleTypes): value is number {
    return typeof value === "number" && !isNaN(value);
}

function isBoolean(value: ConvertAbleTypes): value is boolean {
    return typeof value === "boolean";
}

function isConvertableData(
    value: ConvertAbleTypes | ConvertableData
): value is ConvertableData {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function dataTypeToInputType(value: ConvertAbleTypes): InputTypes | null {
    if (isString(value)) {
        return InputTypes.text;
    } else if (isNumber(value)) {
        return InputTypes.number;
    } else if (isBoolean(value)) {
        return InputTypes.checkbox;
    }

    return null;
}

export function parseToInputTypes<T extends ConvertableData>(
    data: T,
    options: Options = {}
): ConvertedData<T> {
    const includes: string[] = Array.isArray(options.include) ? options.include : [];
    const excludes: string[] = Array.isArray(options.exclude) ? options.exclude : [];

    function inner<I extends ConvertableData>(data: I, accumulatedPath: string) {
        return Object.keys(data).reduce(
            (accum: ConvertedData<I>, key: keyof typeof data): ConvertedData<I> => {
                const dataPath: string = [accumulatedPath, key]
                    .filter((key: string) => key.length > 0)
                    .join(".");

                if (includes.length === 0 && excludes.includes(dataPath)) {
                    return accum;
                }

                const value: typeof data[typeof key] = data[key];

                if (
                    includes.length > 0 &&
                    !includes.includes(dataPath) &&
                    !isConvertableData(value)
                ) {
                    return accum;
                } else {
                    const parsed:
                        | InputTypes
                        | ConvertedData<typeof data[typeof key]>
                        | null = isConvertableData(value)
                        ? inner(value, dataPath)
                        : dataTypeToInputType(value as ConvertAbleTypes);

                    if (parsed === null) {
                        console.log("throwing an error");
                        throw new Error(
                            `The value '${parsed}' at the key of '${key}' could not be converted to an input type`
                        );
                    }

                    return {
                        ...accum,
                        [key]: parsed,
                    };
                }
            },
            {} as ConvertedData<I>
        );
    }

    return inner(data, "");
}
