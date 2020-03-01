import { linkedDataSchema } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Select",
    description: "A select component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/select",
    formPluginId: "@microsoft/fast-components-react-msft/select",
    properties: {
        placeholder: {
            title: "Placeholder",
            type: "string",
        },
        name: {
            title: "Name",
            type: "string",
        },
        form: {
            title: "Form Id",
            type: "string",
        },
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        isMenuOpen: {
            title: "Is menu open",
            type: "boolean",
        },
        required: {
            title: "Required",
            type: "boolean",
        },
        multiselectable: {
            title: "Multiselectable",
            type: "boolean",
        },
        selectedItems: {
            title: "Selected items",
            type: "string",
        },
        defaultSelection: {
            title: "Default selection",
            type: "string",
        },
        autoFocus: {
            title: "Auto focus",
            type: "boolean",
        },
        labelledBy: {
            title: "Labelled by",
            type: "string",
        },
        menuFlyoutConfig: {
            title: "Flyout menu configuration",
            type: "object",
            description: "Configures the viewport positioner used by the flyout menu",
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
            },
        },
        children: {
            ...linkedDataSchema,
            title: "Building blocks",

            formPluginId: "@microsoft/fast-components-react-msft/select/children",
            ids: ["@microsoft/fast-components-react-msft/select-option"],
            defaults: ["listbox-item"],
        },
    },
};
