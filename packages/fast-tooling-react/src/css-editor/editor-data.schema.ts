import {
    backgroundPlugInId,
    borderRadiusPlugInId,
    boxShadowPlugInId,
    colorPlugInId,
    heightPluginId,
    widthPluginId,
} from "./editor.constants";

export default {
    title: "CSS Values",
    $schema: "http://json-schema.org/schema#",
    description: "A CSS editor component's schema data definition.",
    id: "@microsoft/fast-tooling-react/css-editor/data",
    type: "object",
    properties: {
        color: {
            title: "Color",
            type: "string",
            formControlId: colorPlugInId,
        },
        background: {
            title: "Background",
            type: "string",
            formControlId: backgroundPlugInId,
        },
        height: {
            title: "Height",
            type: "string",
            formControlId: heightPluginId,
        },
        width: {
            title: "Width",
            type: "string",
            formControlId: widthPluginId,
        },
        boxShadow: {
            title: "Shadow",
            type: "string",
            formControlId: boxShadowPlugInId,
        },
        borderRadius: {
            title: "Border radius",
            type: "string",
            formControlId: borderRadiusPlugInId,
        },
    },
};
