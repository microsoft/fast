export default {
    oneOf: [
        {
            title: "Component",
            type: "object",
            properties: {
                id: {
                    title: "The id of the JSON schema of the component",
                    type: "string",
                },
                props: {
                    title: "The props defined in the JSON schema of the component",
                    type: "object",
                },
            },
        },
        {
            title: "Null",
            type: "null",
        },
    ],
};
