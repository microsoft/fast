import jest from "jest";
import ajv from "ajv";
import { childrenSchema } from "./";

const validator: ajv.Ajv = new ajv({ schemaId: "auto", allErrors: true });
const validationFn: ajv.ValidateFunction = validator.compile(childrenSchema);

describe("reactChildrenSchema", () => {
    test("should be valid against a number", () => {
        expect(validationFn(1)).toEqual(true);
    });
    test("should be valid against a string", () => {
        expect(validationFn("foo")).toEqual(true);
    });
    test("should be valid against null", () => {
        expect(validationFn(null)).toEqual(true);
    });
    test("should be valid against a component interface", () => {
        expect(validationFn({ id: "foo", props: {} })).toEqual(true);
    });
    test("should be valid against an array containing a number", () => {
        expect(validationFn([1])).toEqual(true);
    });
    test("should be valid against an array containing a string", () => {
        expect(validationFn(["foo"])).toEqual(true);
    });
    test("should be valid against an array contianing null", () => {
        expect(validationFn([null])).toEqual(true);
    });
    test("should be valid against an array containing a component interface", () => {
        expect(validationFn([{ id: "foo", props: {} }])).toEqual(true);
    });
});
