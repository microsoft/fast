/**
 * Complies with FAST Tooling 1.0
 */
export default {
    $schema: "http://json-schema.org/schema#",
    title: "Paragraph",
    description: "A paragraph component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/paragraph",
    formPluginId: "@microsoft/fast-components-react-msft/paragraph",
    properties: {
        size: {
            title: "Size",
            type: "number",
            enum: [1, 2, 3],
        },
    },
    reactProperties: {
        children: {
            title: "Children",
            type: "children",
            formPluginId: "@microsoft/fast-components-react-msft/paragraph/children",
            defaults: ["text"],
            examples: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam risus erat, tincidunt a lectus sit amet, commodo vulputate sem.",
            ],
        },
    },
    required: ["children"],
};
