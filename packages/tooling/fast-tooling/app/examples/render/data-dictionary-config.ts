export default [
    {
        root: {
            schemaId: "div",
            data: {
                foo: "foobar",
                bar: true,
                Slot: [
                    {
                        id: "span",
                    },
                ],
                style: "border:1px solid black;padding:15px;",
            },
        },
        span: {
            parent: {
                id: "root",
                dataLocation: "Slot",
            },
            schemaId: "span",
            data: {
                Slot: [
                    {
                        id: "text",
                    },
                ],
            },
        },
        text: {
            parent: {
                id: "span",
                dataLocation: "Slot",
            },
            schemaId: "text",
            data: "Dynamic Markup!",
        },
    },
    "root",
];
