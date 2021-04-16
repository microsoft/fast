import { WebComponentDefinition } from "../../data-utilities/web-component";
import { DataType } from "../../data-utilities";

export const pathDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "path",
            description: "The path element",
            attributes: [
                {
                    name: "d",
                    description: "The path d",
                    default: "",
                    title: "d",
                    type: DataType.string,
                    required: false,
                },
                {
                    name: "stroke-linecap",
                    description: "The path stroke-linecap",
                    default: "",
                    title: "",
                    type: DataType.string,
                    required: false,
                },
                {
                    name: "stroke-linejoin",
                    description: "The path stroke-linejoin",
                    default: "",
                    title: "",
                    type: DataType.string,
                    required: false,
                },
            ],
            title: "",
            slots: [],
        },
    ],
};
