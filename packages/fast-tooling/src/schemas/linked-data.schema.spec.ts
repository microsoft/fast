import jest from "jest";
import ajv from "ajv";
import { linkedDataSchema } from "./index";

const validator: ajv.Ajv = new ajv({ schemaId: "auto", allErrors: true });
const validationFn: ajv.ValidateFunction = validator.compile(linkedDataSchema);

describe("linked data schema", () => {
    test("should be valid against an array of linked data corresponding to the linekd data schema", () => {
        expect(validationFn([{ id: "foo" }])).toEqual(true);
    });
});
