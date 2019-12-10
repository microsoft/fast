import { colorPlugInId, widthPluginId } from "./editor.constants";

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
        width: {
            title: "Width",
            type: "string",
            formControlId: widthPluginId,
        },
    },
};
