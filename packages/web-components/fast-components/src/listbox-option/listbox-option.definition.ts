import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastOptionDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-option",
            title: "Option",
            description: "The FAST option element",
            attributes: [
                {
                    name: "disabled",
                    type: DataType.boolean,
                    description: "The disabled attribute",
                    default: false,
                    required: false,
                },
                {
                    name: "selected",
                    type: DataType.boolean,
                    description: "The selected attribute",
                    default: false,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The content of the option",
                },
                {
                    name: "start",
                    title: "Start slot",
                    description:
                        "Contents of the start slot are positioned before the option content",
                },
                {
                    name: "end",
                    title: "End slot",
                    description:
                        "Contents of the end slot are positioned after the option content",
                },
            ],
        },
    ],
};
