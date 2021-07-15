export default {
    $schema: "http://json-schema.org/schema#",
    title: "Complex nesting arrays with oneOf",
    type: "object",
    id: "oneOfArrays",
    properties: {
        propertyKey: {
            title: "Property key",
            oneOf: [
                {
                    title: "Containing object",
                    type: "object",
                    properties: {
                        propertyKey1: {
                            title: "propertyKey1 items",
                            type: "object",
                            properties: {
                                propertyKey2: {
                                    title: "propertyKey2",
                                    type: "object",
                                    oneOf: [
                                        {
                                            title: "Alpha",
                                            type: "object",
                                            description: "Alpha",
                                            properties: {
                                                foo: {
                                                    title: "Foo",
                                                    type: "string",
                                                    enum: ["a"],
                                                },
                                                bar: {
                                                    title: "Bar",
                                                    type: "string",
                                                    enum: ["a"],
                                                },
                                            },
                                        },
                                        {
                                            title: "Beta",
                                            type: "object",
                                            description: "Beta",
                                            properties: {
                                                foo: {
                                                    title: "Foo",
                                                    type: "string",
                                                    enum: ["b"],
                                                },
                                                bar: {
                                                    title: "Bar",
                                                    type: "string",
                                                    enum: ["b"],
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    required: ["propertyKey1"],
                },
            ],
        },
    },
};
