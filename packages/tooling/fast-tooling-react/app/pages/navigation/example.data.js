import noChildrenSchema from "./no-children.schema";
import childrenSchema from "./children.schema";
const noChildren = {
    text: "Hello world",
};
const children = [
    {
        foo: {
            schemaId: childrenSchema.id,
            data: {
                children: [
                    {
                        id: "bar",
                    },
                    {
                        id: "bat",
                    },
                    {
                        id: "baz",
                    },
                ],
            },
        },
        bar: {
            parent: {
                id: "foo",
                dataLocation: "children",
            },
            schemaId: noChildrenSchema.id,
            data: {
                text: "bar",
            },
        },
        bat: {
            parent: {
                id: "foo",
                dataLocation: "children",
            },
            schemaId: noChildrenSchema.id,
            data: {
                text: "bat",
            },
        },
        baz: {
            parent: {
                id: "foo",
                dataLocation: "children",
            },
            schemaId: childrenSchema.id,
            data: {
                children: [
                    {
                        id: "bax",
                    },
                ],
            },
        },
        bax: {
            parent: {
                id: "baz",
                dataLocation: "children",
            },
            schemaId: noChildrenSchema.id,
            data: {},
        },
    },
    "foo",
];
export { children, noChildren };
