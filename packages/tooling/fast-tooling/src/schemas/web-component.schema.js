/**
 * This is the data structure for a web component definition
 *
 * Important: if it is updated, also update the "../data-utilities/web-component.ts" file
 */
export default {
    $schema: "http://json-schema.org/schema#",
    $id: "https://fast.design/docs/custom-element-definition",
    title: "A definition for web components",
    type: "object",
    version: 1,
    required: ["version"],
    properties: {
        version: {
            title: "The version of the schema the web components map to",
            type: "number",
            enum: [1],
        },
        tags: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                    },
                    description: {
                        type: "string",
                    },
                    attributes: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                },
                                type: {
                                    type: "string",
                                },
                                description: {
                                    type: "string",
                                },
                                default: {
                                    type: "string",
                                },
                                required: {
                                    type: "boolean",
                                },
                            },
                        },
                    },
                    slots: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                },
                                description: {
                                    type: "string",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
