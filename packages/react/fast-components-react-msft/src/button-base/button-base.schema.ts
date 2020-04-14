/**
 * Complies with FAST Tooling 1.0
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
    },
    reactProperties: {
        children: {
            title: "Children",
            type: "children",
            formPluginId: "@microsoft/fast-components-react-msft/button-base/children",
            defaults: ["text"],
            examples: ["Lorem"],
        },
        beforeContent: {
            title: "Before content",
            type: "children",
            formPluginId:
                "@microsoft/fast-components-react-msft/button-base/beforeContent",
            pluginId: "@microsoft/fast-components-react-msft/button-base/beforeContent",
        },
        afterContent: {
            title: "After content",
            type: "children",
            formPluginId:
                "@microsoft/fast-components-react-msft/button-base/afterContent",
            pluginId: "@microsoft/fast-components-react-msft/button-base/afterContent",
        },
    },
    required: ["children"],
};
