import fancyButtonSchema from "./fancy-button.schema";
import textSchema from "./text.schema";

export enum TestDataType {
    element = "element",
    string = "string",
}

const webComponentSchemas: any = {
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
