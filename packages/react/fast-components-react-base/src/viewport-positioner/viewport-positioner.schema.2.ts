import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Viewport positioner",
    description: "A viewport positioner component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/viewport-positioner",
    properties: {
        disabled: {
            title: "Disabled",
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
        scaleToFit: {
            title: "Scale to fit",
            type: "boolean",
            default: false,
        },
        children: {
            ...linkedDataSchema,
        },
    },
};
