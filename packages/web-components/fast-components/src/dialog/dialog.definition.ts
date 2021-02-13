import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastDialogDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-dialog",
            title: "Dialog",
            description: "The FAST dialog element",
            attributes: [
                {
                    name: "modal",
                    title: "Modal",
                    type: DataType.boolean,
                    description:
                        "When modal, user interaction will be limited to the contents of the element",
                    default: true,
                    required: false,
                },
                {
                    name: "hidden",
                    title: "Hidden",
                    description: "The hidden state of the element",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "trap-focus",
                    title: "Trap focus",
                    description: "Indicates that the dialog should trap focus",
                    type: DataType.boolean,
                    default: true,
                    required: false,
                },
                {
                    name: "aria-describedby",
                    description: "The HTML aria-describedby attribute",
                    type: DataType.string,
                    default: false,
                    required: false,
                },
                {
                    name: "aria-labelledby",
                    description: "The HTML aria-labelledby attribute",
                    type: DataType.string,
                    default: false,
                    required: false,
                },
                {
                    name: "aria-label",
                    description: "The HTML aria-label attribute",
                    type: DataType.string,
                    default: false,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The dialog content",
                },
            ],
        },
    ],
};
