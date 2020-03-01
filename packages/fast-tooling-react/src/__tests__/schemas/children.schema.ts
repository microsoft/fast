import { linkedDataSchema } from "@microsoft/fast-tooling";

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
                    ...linkedDataSchema,
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
                        ...linkedDataSchema,
                    },
                },
            },
        },
        children: {
            title: "Children",
            ...linkedDataSchema,
            formControlId: "react-children",
            defaults: ["text"],
            examples: ["Foo"],
        },
        restrictedWithChildren: {
            title: "Restricted children with react defaults",
            ...linkedDataSchema,
            ids: ["objects", "arrays"],
            defaults: ["text"],
        },
        restrictedChildrenWithReactDefaults: {
            title: "Restricted children without react defaults",
            ...linkedDataSchema,
            ids: ["children"],
        },
    },
};
