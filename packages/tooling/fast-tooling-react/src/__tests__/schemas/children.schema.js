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
                nestedObjectChildren: Object.assign({ title: "Children in object" }, linkedDataSchema),
            },
        },
        arrayContainingNestedChildren: {
            title: "Array with nested children",
            type: "array",
            items: {
                title: "Nested array item",
                type: "object",
                properties: {
                    nestedArrayChildren: Object.assign({ title: "Children" }, linkedDataSchema),
                },
            },
        },
        children: Object.assign(Object.assign({ title: "Children" }, linkedDataSchema), { formControlId: "react-children", defaults: ["text"], examples: ["Foo"] }),
        restrictedWithChildren: Object.assign(Object.assign({ title: "Restricted children with react defaults" }, linkedDataSchema), { ids: ["objects", "arrays"], defaults: ["text"] }),
        restrictedChildrenWithReactDefaults: Object.assign(Object.assign({ title: "Restricted children without react defaults" }, linkedDataSchema), { ids: ["children"] }),
    },
};
