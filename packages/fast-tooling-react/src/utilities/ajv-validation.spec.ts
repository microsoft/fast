import {
    getValidationErrors,
    removeAllCachedValidation,
    removeCachedSchemaValidation,
    validateData,
} from "./ajv-validation";

import { ErrorObject } from "ajv";
import oneOfSchema from "../__tests__/schemas/one-of.schema.json";

describe("validateData", () => {
    test("should validate data against schema and return same result after subsequent call.", () => {
        const data: any = {
            number: 36,
        };

        const validationResult: boolean | PromiseLike<any> = validateData(
            oneOfSchema,
            data
        );
        const validationResultFromCached: boolean | PromiseLike<any> = validateData(
            oneOfSchema,
            data
        );

        expect(validationResult).toBeTruthy();
        expect(validationResultFromCached).toBeTruthy();
        expect(validationResult).toEqual(validationResultFromCached);
    });
});

describe("getValidationErrors", () => {
    test("should validate schema and return array of error objects.", () => {
        const data: any = {};

        const validationErrors: ErrorObject[] = getValidationErrors(oneOfSchema, data);
        const validationErrorsFromCached: ErrorObject[] = getValidationErrors(
            oneOfSchema,
            data
        );

        expect(validationErrors.length).toEqual(5);
        expect(validationErrorsFromCached.length).toEqual(5);
        expect(validationErrors[0]).toEqual(validationErrorsFromCached[0]);
        expect(validationErrors[1]).toEqual(validationErrorsFromCached[1]);
        expect(validationErrors[2]).toEqual(validationErrorsFromCached[2]);
        expect(validationErrors[3]).toEqual(validationErrorsFromCached[3]);
        expect(validationErrors[4]).toEqual(validationErrorsFromCached[4]);
    });
});

describe("removeAllCachedValidation", () => {
    test("should remove all cached validation without error.", () => {
        expect(() => removeAllCachedValidation()).not.toThrow();
    });
});

describe("removeCachedValidation", () => {
    test("should not throw an error when there is no schema to remove.", () => {
        expect(() => removeCachedSchemaValidation(oneOfSchema)).not.toThrow();
    });

    test("should remove cached schema validation without error.", () => {
        const data: any = {};
        validateData(oneOfSchema, data);

        expect(() => removeCachedSchemaValidation(oneOfSchema)).not.toThrow();
    });
});
