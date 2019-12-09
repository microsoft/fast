export default {
    $schema: "http://json-schema.org/schema#",
    title: " stack panel",
    description: "A  stack panel component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-base/stack-panel",
    properties: {},
    reactProperties: {
        children: {
            title: "Children",
            type: "children",
            defaults: ["text"],
        },
    },
};
