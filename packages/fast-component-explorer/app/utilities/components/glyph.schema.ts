export default {
    $schema: "http://json-schema.org/schema#",
    title: "Test Glyph",
    id: "glyph",
    type: "object",
    properties: {
        path: {
            title: "Icon",
            type: "string",
            enum: ["play", "pause", "robot", "user", "arrow", "download"],
            default: "play",
        },
    },
};
