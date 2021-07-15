export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with anyOf",
    description: "A test component's schema definition.",
    type: "object",
    id: "anyOf",
    anyOf: [
        {
            description: "String",
            type: "object",
            additionalProperties: false,
            properties: {
                string: {
                    title: "String",
                    type: "string",
                },
            },
        },
        {
            description: "Number",
            type: "object",
            additionalProperties: false,
            properties: {
                number: {
                    title: "Number",
                    type: "number",
                },
            },
        },
        {
            description: "Sub-object alpha",
            type: "object",
            additionalProperties: false,
            properties: {
                subObjectAlpha: {
                    title: "Sub-object alpha",
                    type: "object",
                    properties: {
                        foo: {
                            title: "Sub-object alpha foo",
                            type: "string",
                        },
                    },
                },
            },
        },
        {
            description: "Sub-object beta",
            type: "object",
            additionalProperties: false,
            properties: {
                subObjectBeta: {
                    title: "Sub-object beta",
                    type: "object",
                    properties: {
                        bar: {
                            title: "Sub-object alpha bar",
                            type: "string",
                        },
                    },
                },
            },
        },
        {
            title: "Nested anyOf",
            description: "Nested anyOf",
            type: "object",
            additionalProperties: false,
            properties: {
                nestedAnyOf: {
                    title: "Nested anyOf",
                    description: "Nested anyOf Configuration",
                    anyOf: [
                        {
                            description: "Object",
                            type: "object",
                            properties: {
                                object: {
                                    title: "String",
                                    type: "object",
                                    properties: {
                                        string: {
                                            title: "String",
                                            type: "string",
                                        },
                                    },
                                    required: ["string"],
                                },
                            },
                            required: ["object"],
                        },
                        {
                            description: "String",
                            type: "object",
                            properties: {
                                string: {
                                    title: "String",
                                    type: "string",
                                },
                            },
                            required: ["string"],
                        },
                        {
                            description: "Number",
                            type: "object",
                            properties: {
                                number: {
                                    title: "Number",
                                    type: "number",
                                },
                            },
                            required: ["number"],
                        },
                    ],
                },
            },
        },
        {
            additionalProperties: false,
            description: "Number or String",
            type: "object",
            properties: {
                numberOrString: {
                    anyOf: [
                        {
                            title: "Number",
                            type: "number",
                        },
                        {
                            title: "String",
                            type: "string",
                        },
                        {
                            title: "Array",
                            type: "array",
                            items: {
                                title: "Array item",
                                type: "string",
                            },
                        },
                        {
                            title: "Array with anyOf in items",
                            type: "array",
                            items: {
                                anyOf: [
                                    {
                                        additionalProperties: false,
                                        title: "Array item object",
                                        type: "object",
                                        properties: {
                                            string: {
                                                title: "Array item object string",
                                                type: "string",
                                            },
                                        },
                                    },
                                    {
                                        title: "Array item number",
                                        type: "number",
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            required: ["numberOrString"],
        },
    ],
};
