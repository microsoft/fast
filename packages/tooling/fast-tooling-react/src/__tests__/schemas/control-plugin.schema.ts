export default {
    $schema: "https://json-schema.org/schema#",
    title: "Component with custom controls",
    description: "A test component's schema definition.",
    type: "object",
    id: "customControl",
    properties: {
        textAlign: {
            title: "Text align",
            type: "string",
            enum: ["left", "center", "right"],
            formControlId: "custom-controls/textAlign",
        },
        align: {
            title: "Align",
            type: "string",
            enum: ["top", "center", "bottom"],
            formControlId: "custom-controls/align",
        },
        fileUpload: {
            title: "File upload",
            type: "string",
            formControlId: "custom-controls/fileUpload",
        },
        theme: {
            title: "Theme",
            type: "string",
            enum: ["light", "dark"],
            formControlId: "custom-controls/theme",
        },
    },
};
