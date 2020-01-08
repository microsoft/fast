import { childrenSchema, ChildrenType } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Button base",
    description: "A MSFT button base component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/button-base",
    formPluginId: "@microsoft/fast-components-react-msft/button-base",
    properties: {
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        href: {
            title: "HTML href attribute",
            type: "string",
        },
        children: {
            ...childrenSchema,
            formPluginId: "@microsoft/fast-components-react-msft/button-base/children",
            examples: ["Lorem"],
            allowTypes: [ChildrenType.string, ChildrenType.component],
        },
        beforeContent: {
            ...childrenSchema,
            title: "Before content",
            formPluginId:
                "@microsoft/fast-components-react-msft/button-base/beforeContent",
            pluginId: "@microsoft/fast-components-react-msft/button-base/beforeContent",
            allowTypes: [ChildrenType.component],
        },
        afterContent: {
            ...childrenSchema,
            title: "After content",
            formPluginId:
                "@microsoft/fast-components-react-msft/button-base/afterContent",
            pluginId: "@microsoft/fast-components-react-msft/button-base/afterContent",
            allowTypes: [ChildrenType.component],
        },
    },
    required: ["children"],
};
