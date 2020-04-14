import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Auto suggest option",
    description: "An auto suggest option component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/auto-suggest-option",
    properties: {
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        displayString: {
            title: "Display string",
            type: "string",
        },
        id: {
            title: "Unique ID",
            type: "string",
        },
        value: {
            title: "Value",
            type: "string",
        },
        children: {
            ...linkedDataSchema,
        },
    },
    required: ["id", "value"],
};
