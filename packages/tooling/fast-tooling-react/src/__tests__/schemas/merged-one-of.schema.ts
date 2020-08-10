export default {
    $schema: "https://json-schema.org/schema#",
    type: "object",
    id: "mergedOneOf",
    title: "Merged oneOf",
    properties: {
        foo: {
            title: "Foo",
            type: "object",
            required: ["a", "b"],
            oneOf: [
                {
                    title: "Overridden Foo 1",
                    description: "A is string",
                    properties: {
                        a: {
                            title: "A",
                            type: "string",
                        },
                        b: {
                            title: "B",
                            type: "number",
                        },
                    },
                },
                {
                    title: "Overridden Foo 2",
                    description: "B is string",
                    properties: {
                        a: {
                            title: "A",
                            type: "number",
                        },
                        b: {
                            title: "B",
                            type: "string",
                        },
                    },
                },
            ],
        },
    },
};
