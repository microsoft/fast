import { parseToInputTypes, InputTypes } from "./design-system-parser";

describe("parseToInputTypes", (): void => {
    test("should return an empty object when provided an object with no keys", (): void => {
        expect(parseToInputTypes({})).toMatchObject({});
    });
    test("should return an object with a key value of string to a key value of InputTypes.text", (): void => {
        expect(parseToInputTypes({ stringType: "string value" })).toMatchObject({
            stringType: InputTypes.text,
        });
    });
    test("should return an object with a key value of number to a key value of InputTypes.number", (): void => {
        expect(parseToInputTypes({ numberType: 0 })).toMatchObject({
            numberType: InputTypes.number,
        });
    });
    test("should return an object with a key value of boolean to a key value of InputTypes.boolean", (): void => {
        expect(parseToInputTypes({ booleanType: true })).toMatchObject({
            booleanType: InputTypes.checkbox,
        });
    });
    test("should throw when an unsupported type is supplied", (): void => {
        expect(() => {
            parseToInputTypes({ unsuportedType: NaN });
        }).toThrow();
    });
    test("should convert nested data structures", (): void => {
        expect(parseToInputTypes({ nestedType: { booleanType: true } })).toMatchObject({
            nestedType: { booleanType: InputTypes.checkbox },
        });
    });
});
