import { CodePreviewChildOption } from "../../../src/data-utilities/mapping";

import badgeSchema from "../../../src/__tests__/schemas/badge.schema.json";
import childrenSchema from "../../../src/__tests__/schemas/children.schema.json";
import textFieldSchema from "../../../src/__tests__/schemas/text-field.schema.json";

const textFieldJSXName: string = "TextField";
const childrenJSXName: string = "Children";
const badgeJSXName: string = "Badge";

export const childOptions: CodePreviewChildOption[] = [
    {
        name: textFieldJSXName,
        schema: textFieldSchema,
    },
    {
        name: childrenJSXName,
        schema: childrenSchema,
    },
    {
        name: badgeJSXName,
        schema: badgeSchema,
    },
];

const exampleData: any[] = [
    {
        exampleName: "Basic",
        config: {
            data: {
                id: badgeSchema.id,
            },
            childOptions,
        },
    },
    {
        exampleName: "Nested",
        config: {
            data: {
                id: childrenSchema.id,
                props: {
                    children: {
                        id: badgeSchema.id,
                        props: {
                            children: "foo",
                        },
                    },
                },
            },
            childOptions,
        },
    },
    {
        exampleName: "Attributes",
        config: {
            data: {
                id: badgeSchema.id,
                props: {
                    string: "foo",
                    children: {
                        id: badgeSchema.id,
                        props: {
                            string: "bar",
                            children: "bat",
                        },
                    },
                },
            },
            childOptions,
        },
    },
    {
        exampleName: "Variables",
        config: {
            data: {
                id: badgeSchema.id,
                props: {
                    object: {
                        number: 42,
                    },
                },
            },
            childOptions,
        },
    },
];

export default exampleData;
