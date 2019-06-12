import { parseToInputTypes, InputTypes } from "./design-system-parser";

describe("parseToInputTypes", (): void => {
    test("should return an empty object when provided an object with no keys", (): void => {
        expect(parseToInputTypes({})).toEqual({});
    });
    test("should return an object with a key value of string to a key value of InputTypes.text", (): void => {
        expect(parseToInputTypes({ stringType: "string value" })).toEqual({
            stringType: InputTypes.text,
        });
    });
    test("should return an object with a key value of number to a key value of InputTypes.number", (): void => {
        expect(parseToInputTypes({ numberType: 0 })).toEqual({
            numberType: InputTypes.number,
        });
    });
    test("should return an object with a key value of boolean to a key value of InputTypes.boolean", (): void => {
        expect(parseToInputTypes({ booleanType: true })).toEqual({
            booleanType: InputTypes.checkbox,
        });
    });
    test("should throw when an unsupported type is supplied", (): void => {
        expect(() => {
            parseToInputTypes({ unsuportedType: NaN });
        }).toThrow();
    });
    test("should convert nested data structures", (): void => {
        expect(parseToInputTypes({ nestedType: { booleanType: true } })).toEqual({
            nestedType: { booleanType: InputTypes.checkbox },
        });
    });

    test("should return an object omitting root paths excluded by exclude paths", (): void => {
        expect(
            parseToInputTypes(
                {
                    stringType: "string value",
                    omittedType: true,
                },
                { exclude: ["omittedType"] }
            )
        ).toEqual({ stringType: InputTypes.text });
    });
    test("should return an object omitting all nested paths excluded by exclude paths", (): void => {
        expect(
            parseToInputTypes(
                {
                    stringType: "string value",
                    objectType: {
                        numberType: 0,
                        omittedType: true,
                    },
                },
                { exclude: ["objectType.omittedType"] }
            )
        ).toEqual({
            stringType: InputTypes.text,
            objectType: { numberType: InputTypes.number },
        });
    });

    test("should only include paths in include array if an include array is provided", (): void => {
        expect(
            parseToInputTypes(
                {
                    stringType: "string value",
                    numberType: 0,
                    booleanType: true,
                },
                {
                    include: ["stringType"],
                }
            )
        ).toEqual({
            stringType: InputTypes.text,
        });
    });

    test("should only include nested paths in include array if an include array is provided", (): void => {
        expect(
            parseToInputTypes(
                {
                    stringType: "string value",
                    numberType: 0,
                    booleanType: true,
                    nested: {
                        numberType: 0,
                        includedType: "included value",
                    },
                },
                {
                    include: ["nested.includedType"],
                }
            )
        ).toEqual({
            nested: {
                includedType: InputTypes.text,
            },
        });
    });

    test("should ignore excludes when includes are provided", (): void => {
        expect(
            parseToInputTypes(
                {
                    stringType: "string value",
                    numberType: 0,
                    booleanType: true,
                    nested: {
                        numberType: 0,
                        includedType: "included value",
                    },
                },
                {
                    include: ["nested.includedType", "numberType"],
                    exclude: ["nested.includedType"],
                }
            )
        ).toEqual({
            numberType: InputTypes.number,
            nested: {
                includedType: InputTypes.text,
            },
        });
    });

    test("should not throw on invalid inputs if they are excluded", (): void => {
        expect(
            (): void => {
                parseToInputTypes(
                    {
                        invalidType: ["invalid value"] as any,
                    },
                    { exclude: ["invalidType"] }
                );
            }
        ).not.toThrow();
    });

    test("should not throw on invalid inputs if they are not in the include array", (): void => {
        expect(
            (): void => {
                parseToInputTypes(
                    {
                        stringType: "string value",
                        invalidType: ["invalid value"] as any,
                        nestedType: {
                            nestedInvalidType: ["nested invalid value"] as any,
                            nestedStringType: "nested string value",
                        },
                    },
                    { include: ["stringType", "nestedType.nestedStringType"] }
                );
            }
        ).not.toThrow();
    });
});
