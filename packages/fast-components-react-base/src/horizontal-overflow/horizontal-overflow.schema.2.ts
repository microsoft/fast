import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Horizontal overflow",
    description: "A horizontal overflow component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/horizontal-overflow",
    formPluginId: "@microsoft/fast-components-react-base/horizontal-overflow",
    properties: {
        scrollDuration: {
            title: "Scroll duration",
            type: "number",
        },
        nextItemPeek: {
            title: "Next item peek",
            type: "number",
        },
        children: {
            ...linkedDataSchema,
            formPluginId:
                "@microsoft/fast-components-react-base/horizontal-overflow/children",
        },
    },
};
