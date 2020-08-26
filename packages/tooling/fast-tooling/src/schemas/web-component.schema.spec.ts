import ajv from "ajv";
import { enableHttpsSchema } from "../data-utilities/ajv-validation";
import { webComponentSchema } from "./index";

const validator: ajv.Ajv = enableHttpsSchema(
    new ajv({ schemaId: "auto", allErrors: true })
);
const validationFn: ajv.ValidateFunction = validator.compile(webComponentSchema);

describe("web component schema", () => {
    test("should be valid against a web component schema", () => {
        expect(
            validationFn({
                version: 1,
            })
        ).toEqual(true);
    });
});
