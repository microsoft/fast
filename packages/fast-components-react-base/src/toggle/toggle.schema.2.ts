import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Toggle",
    description: "A toggle component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/toggle",
    formPluginId: "@microsoft/fast-components-react-base/toggle",
    properties: {
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        inputId: {
            title: "HTML id attribute",
            type: "string",
        },
        labelId: {
            title: "HTML label id attribute",
            type: "string",
        },
        name: {
            title: "Name",
            type: "string",
            examples: ["name"],
        },
        selected: {
            title: "Selected",
            type: "boolean",
        },
        selectedMessage: {
            title: "Selected text",
            type: "string",
        },
        statusMessageId: {
            title: "HTML status label id attribute",
            type: "string",
        },
        unselectedMessage: {
            title: "Unselected text",
            type: "string",
        },
        children: {
            ...linkedDataSchema,
            formPluginId: "@microsoft/fast-components-react-base/toggle/children",
        },
    },
    required: ["id"],
};
