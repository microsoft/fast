import { childrenSchema, ChildrenType } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Accent button",
    description: "An accent button component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/accent-button",
    formPluginId: "@microsoft/fast-components-react-msft/accent-button",
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
            formPluginId: "@microsoft/fast-components-react-msft/accent-button/children",
            examples: ["Lorem"],
        },
        beforeContent: {
            ...childrenSchema,
            title: "Before content",
            formPluginId:
                "@microsoft/fast-components-react-msft/accent-button/beforeContent",
            pluginId: "@microsoft/fast-components-react-msft/accent-button/beforeContent",
            allowTypes: [ChildrenType.component],
        },
        afterContent: {
            ...childrenSchema,
            title: "After content",
            formPluginId:
                "@microsoft/fast-components-react-msft/accent-button/afterContent",
            pluginId: "@microsoft/fast-components-react-msft/accent-button/afterContent",
            allowTypes: [ChildrenType.component],
        },
    },
    required: ["children"],
};
