import { linkedDataSchema } from "@microsoft/fast-tooling";

export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with children",
    description: "A test component's schema definition.",
    type: "object",
    id: "children",
    properties: {
        object: {
            title: "Object",
            type: "object",
            properties: {
                children: {
                    title: "Object Children",
                    ...linkedDataSchema,
                },
            },
        },
        array: {
            title: "Array",
            type: "array",
            items: {
                title: "Object",
                type: "object",
                properties: {
                    children: {
                        title: "Array Children",
                        ...linkedDataSchema,
                    },
                },
            },
        },
        children: {
            title: "Children",
            ...linkedDataSchema,
        },
    },
};
