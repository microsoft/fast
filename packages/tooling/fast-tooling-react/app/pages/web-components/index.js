import fancyButtonSchema from "./fancy-button.schema";
import textSchema from "./text.schema";
export var TestDataType;
(function (TestDataType) {
    TestDataType["element"] = "element";
    TestDataType["string"] = "string";
})(TestDataType || (TestDataType = {}));
const webComponentSchemas = {
    [fancyButtonSchema.id]: {
        data: {},
        type: TestDataType.element,
        schema: fancyButtonSchema,
    },
    [textSchema.id]: {
        data: "foo",
        type: TestDataType.string,
        schema: textSchema,
    },
};
export { webComponentSchemas };
