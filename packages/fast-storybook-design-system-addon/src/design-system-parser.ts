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

type ConvertAbleTypes = string | number | boolean;

interface ConvertableData {
    [key: string]: ConvertAbleTypes | ConvertableData;
}

type ConvertedData<T> = {
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
    return typeof value === "object" && value !== null;
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

export function parseToInputTypes<T extends ConvertableData>(data: T): ConvertedData<T> {
    return Object.keys(data).reduce(
        (accum: ConvertedData<T>, key: keyof typeof data): ConvertedData<T> => {
            const value: typeof data[typeof key] = data[key];

            const parsed:
                | InputTypes
                | ConvertedData<typeof data[typeof key]>
                | null = isConvertableData(value)
                ? parseToInputTypes(value)
                : dataTypeToInputType(value as ConvertAbleTypes);

            if (parsed === null) {
                throw new Error(
                    `The value '${parsed}' at the key of '${key}' could not be converted to an input type`
                );
            }

            return {
                ...accum,
                [key]: parsed,
            };
        },
        {} as ConvertedData<T>
    );
}
