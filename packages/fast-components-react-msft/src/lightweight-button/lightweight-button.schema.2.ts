import { childrenSchema, ChildrenType } from "@microsoft/fast-tooling";

/**
 * Complies with FAST Tooling 2.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Lightweight button",
    description: "A lightweight button component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/lightweight-button",
    formPluginId: "@microsoft/fast-components-react-msft/lightweight-button",
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
            formPluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/children",
            allowTypes: [ChildrenType.string, ChildrenType.component],
            examples: ["Lorem"],
        },
        beforeContent: {
            ...childrenSchema,
            title: "Before content",
            allowTypes: [ChildrenType.component],
            formPluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/beforeContent",
            pluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/beforeContent",
        },
        afterContent: {
            ...childrenSchema,
            title: "After content",
            allowTypes: [ChildrenType.component],
            formPluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/afterContent",
            pluginId:
                "@microsoft/fast-components-react-msft/lightweight-button/afterContent",
        },
    },
    required: ["children"],
};
