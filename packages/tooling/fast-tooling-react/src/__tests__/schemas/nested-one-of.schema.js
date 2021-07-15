export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with a nested oneOf",
    description: "A test component's schema definition.",
    type: "object",
    id: "nestedOneOf",
    properties: {
        single: {
            title: "Single oneOf",
            type: "object",
            oneOf: [
                {
                    title: "Object",
                    description: "string",
                    type: "object",
                    properties: {
                        omega: {
                            title: "Omega",
                            type: "string",
                        },
                        alpha: {
                            title: "Alpha",
                            type: "object",
                            properties: {
                                beta: {
                                    title: "string",
                                    type: "string",
                                },
                            },
                        },
                    },
                    required: ["omega", "alpha"],
                },
            ],
        },
    },
};
