import noChildrenSchema from "./no-children.schema";
import childrenSchema from "./children.schema";
import { DataDictionary } from "../../../src/message-system/data.props";

const noChildren: any = {
    text: "Hello world",
};

const children: DataDictionary<any> = [
    {
        "": {
            schemaId: childrenSchema.id,
            data: {
                children: [
                    {
                        id: "children[0]",
                        dataLocation: "children",
                    },
                    {
                        id: "children[1]",
                        dataLocation: "children",
                    },
                ],
            },
        },
        "children[0]": {
            parent: {
                id: "",
                dataLocation: "children",
            },
            schemaId: noChildrenSchema.id,
            data: {
                text: "bar",
            },
        },
        "children[1]": {
            parent: {
                id: "",
                dataLocation: "children",
            },
            schemaId: noChildrenSchema.id,
            data: {
                text: "bat",
            },
        },
    },
    "",
];

export { children, noChildren };
