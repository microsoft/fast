import ajv from "ajv";
import { expect } from "chai";
import { linkedDataSchema } from "./index";
const validator = new ajv({ schemaId: "auto", allErrors: true });
const validationFn = validator.compile(linkedDataSchema);
describe("linked data schema", () => {
    it("should be valid against an array of linked data corresponding to the linekd data schema", () => {
        expect(validationFn([{ id: "foo" }])).to.equal(true);
    });
});
