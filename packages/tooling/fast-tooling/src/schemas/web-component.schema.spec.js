import ajv from "ajv";
import { expect } from "chai";
import { webComponentSchema } from "./index";
const validator = new ajv({ schemaId: "auto", allErrors: true });
const validationFn = validator.compile(webComponentSchema);
describe("web component schema", () => {
    it("should be valid against a web component schema", () => {
        expect(
            validationFn({
                version: 1,
            })
        ).to.equal(true);
    });
});
