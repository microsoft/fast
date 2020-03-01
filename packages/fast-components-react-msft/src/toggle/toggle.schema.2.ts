import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Toggle",
    description: "A toggle component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/toggle",
    formPluginId: "@microsoft/fast-components-react-msft/toggle",
    properties: {
        id: {
            title: "HTML id attribute",
            type: "string",
        },
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
            defaults: ["name"],
        },
        selected: {
            title: "Selected",
            type: "boolean",
        },
        selectedMessage: {
            title: "Selected text",
            type: "string",
            examples: ["Ipsum"],
        },
        statusMessageId: {
            title: "HTML status label id attribute",
            type: "string",
        },
        unselectedMessage: {
            title: "Unselected text",
            type: "string",
            examples: ["Lorem"],
        },
        children: {
            ...linkedDataSchema,

            formPluginId: "@microsoft/fast-components-react-msft/toggle/children",
            defaults: ["text"],
        },
    },
    required: ["id"],
};
