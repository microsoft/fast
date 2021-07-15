import { linkedDataSchema } from "@microsoft/fast-tooling";
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with custom properties ",
    description: "A test component's schema definition.",
    type: "object",
    id: "children-with-react-props",
    properties: {
        boolean: {
            title: "Boolean",
            type: "boolean",
            pluginId: "boolean-plugin-resolver",
        },
        array: {
            title: "Array of strings",
            type: "array",
            pluginId: "array-plugin-resolver",
            items: {
                title: "String",
                type: "string",
            },
        },
        arrayObject: {
            title: "Array of objects",
            type: "array",
            items: {
                title: "Object",
                type: "object",
                properties: {
                    content: Object.assign(Object.assign({}, linkedDataSchema), { pluginId: "children-plugin-resolver" }),
                },
            },
        },
        render: Object.assign(Object.assign({}, linkedDataSchema), { pluginId: "children-plugin-resolver" }),
    },
};
