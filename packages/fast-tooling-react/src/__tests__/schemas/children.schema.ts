import { childrenSchema } from "@microsoft/fast-tooling";

export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with children",
    description: "A test component's schema definition.",
    type: "object",
    id: "children",
    properties: {
        objectContainingNestedChildren: {
            title: "Object with nested children",
            type: "object",
            properties: {
                nestedObjectChildren: {
                    title: "Children in object",
                    ...childrenSchema,
                },
            },
        },
        arrayContainingNestedChildren: {
            title: "Array with nested children",
            type: "array",
            items: {
                title: "Nested array item",
                type: "object",
                properties: {
                    nestedArrayChildren: {
                        title: "Children",
                        ...childrenSchema,
                    },
                },
            },
        },
        children: {
            title: "Children",
            ...childrenSchema,
            defaults: ["text"],
            examples: ["Foo"],
        },
        restrictedWithChildren: {
            title: "Restricted children with react defaults",
            ...childrenSchema,
            ids: ["objects", "arrays"],
            defaults: ["text"],
        },
        restrictedChildrenWithReactDefaults: {
            title: "Restricted children without react defaults",
            ...childrenSchema,
            ids: ["children"],
        },
    },
    required: ["children"],
};
