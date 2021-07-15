import { linkedDataSchema } from "@microsoft/fast-tooling";
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with oneOf",
    description: "A test component's schema definition.",
    type: "object",
    id: "oneOf",
    oneOf: [
        {
            description: "string",
            type: "object",
            additionalProperties: false,
            properties: {
                string: {
                    title: "string",
                    type: "string",
                },
            },
            required: ["string"],
        },
        {
            description: "number",
            type: "object",
            additionalProperties: false,
            properties: {
                number: {
                    title: "number",
                    type: "number",
                },
            },
            required: ["number"],
        },
        {
            title: "Number or string",
            description: "number or string",
            type: "object",
            additionalProperties: false,
            properties: {
                numberOrString: {
                    title: "Number or string configuration",
                    oneOf: [
                        {
                            title: "number",
                            type: "number",
                        },
                        {
                            title: "string",
                            type: "string",
                        },
                        {
                            title: "object",
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                object: {
                                    title: "An object",
                                    type: "object",
                                    properties: {
                                        number: {
                                            title: "number",
                                            type: "number",
                                        },
                                    },
                                    required: ["number"],
                                },
                            },
                            required: ["object"],
                        },
                        {
                            title: "array",
                            type: "array",
                            items: {
                                title: "Array",
                                oneOf: [
                                    {
                                        title: "string item",
                                        type: "string",
                                    },
                                    {
                                        title: "number item",
                                        type: "number",
                                    },
                                ],
                            },
                        },
                        {
                            title: "children object",
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                children: Object.assign({}, linkedDataSchema),
                            },
                        },
                    ],
                },
            },
            required: ["numberOrString"],
        },
        {
            description: "category",
            type: "object",
            additionalProperties: false,
            properties: {
                foo: {
                    title: "string",
                    type: "string",
                },
            },
            required: ["foo"],
            formConfig: {
                categories: [
                    {
                        title: "Category A",
                        expandable: true,
                        items: ["foo"],
                    },
                ],
            },
        },
    ],
};
