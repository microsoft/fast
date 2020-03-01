import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Progress",
    description: "A progress component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/progress",
    formPluginId: "@microsoft/fast-components-react-base/progress",
    properties: {
        value: {
            title: "HTML value attribute",
            type: "number",
        },
        minValue: {
            title: "HTML minValue attribute",
            type: "number",
        },
        maxValue: {
            title: "HTML maxValue attribute",
            type: "number",
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-base/progress/children",
        },
    },
};
