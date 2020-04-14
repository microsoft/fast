import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Flyout",
    description: "A flyout component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/flyout",
    formPluginId: "@microsoft/fast-components-react-msft/flyout",
    properties: {
        visible: {
            title: "Visible",
            type: "boolean",
        },
        horizontalPositioningMode: {
            title: "Horizontal positioning mode",
            type: "string",
            default: "uncontrolled",
            enum: ["uncontrolled", "adjacent", "inset"],
        },
        defaultHorizontalPosition: {
            title: "Default horizontal position",
            type: "string",
            default: "uncontrolled",
            enum: ["left", "right", "uncontrolled"],
        },
        height: {
            title: "Height",
            type: "string",
            default: "128px",
        },
        horizontalThreshold: {
            title: "Horizontal threshold",
            type: "number",
        },
        horizontalAlwaysInView: {
            title: "Horizontal always in view",
            type: "boolean",
        },
        verticalPositioningMode: {
            title: "Vertical positioning mode",
            type: "string",
            default: "uncontrolled",
            enum: ["uncontrolled", "adjacent", "inset"],
        },
        defaultVerticalPosition: {
            title: "Default vertical position",
            type: "string",
            default: "uncontrolled",
            enum: ["top", "bottom", "uncontrolled"],
        },
        verticalThreshold: {
            title: "Vertical threshold",
            type: "number",
        },
        verticalAlwaysInView: {
            title: "Vertical always in view",
            type: "boolean",
        },
        fixedAfterInitialPlacement: {
            title: "Fixed after initial placement",
            type: "boolean",
        },
        width: {
            title: "Width",
            type: "string",
            default: "280px",
        },
        children: {
            ...linkedDataSchema,
        },
    },
};
