export default {
    $schema: "http://json-schema.org/schema#",
    title: "Component with defaults",
    description: "A test component's schema definition.",
    type: "object",
    id: "defaults",
    properties: {
        a: {
            title: "With default",
            type: "string",
            default: "correct",
        },
        b: {
            title: "Without default",
            type: "string",
        },
        c: {
            title: "With default",
            type: "object",
            properties: {
                alpha: {
                    title: "With default",
                    type: "string",
                    default: "correct",
                },
                beta: {
                    title: "Without default",
                    type: "string",
                },
            },
            default: {
                alpha: "incorrect",
                beta: "correct",
            },
        },
        d: {
            title: "Without default",
            type: "object",
            properties: {
                alpha: {
                    title: "With default",
                    type: "string",
                    default: "correct",
                },
                beta: {
                    title: "Without default",
                    type: "string",
                },
            },
        },
        e: {
            title: "With default",
            type: "array",
            items: {
                title: "With default",
                type: "string",
                default: "correct",
            },
            default: ["correct", "correct"],
        },
        f: {
            title: "With default",
            type: "string",
            enum: ["foo", "bar"],
            default: "bar",
        },
        g: {
            title: "With default",
            type: "boolean",
            default: true,
        },
        h: {
            title: "With default",
            type: "string",
            default: "foo",
            const: "foo",
        },
        i: {
            title: "With default",
            type: "null",
            default: null,
        },
    },
    default: {
        a: "incorrect",
        b: "correct",
        c: {
            alpha: "incorrect",
            beta: "incorrect",
        },
        d: {
            alpha: "incorrect",
            beta: "correct",
        },
        e: ["correct"],
    },
};
