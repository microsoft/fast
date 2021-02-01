import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastDialogDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-dialog",
            description: "The FAST dialog element",
            attributes: [
                {
                    name: "modal",
                    type: DataType.boolean,
                    description: "The model attribute",
                    default: true,
                    required: false,
                },
                {
                    name: "hidden",
                    description: "The hidden attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "trap-focus",
                    description: "The trap-focus attribute",
                    type: DataType.boolean,
                    default: true,
                    required: false,
                },
                {
                    name: "aria-describedby",
                    description: "The aria-describedby attribute",
                    type: DataType.string,
                    default: false,
                    required: false,
                },
                {
                    name: "aria-labelledby",
                    description: "The aria-labelledby attribute",
                    type: DataType.string,
                    default: false,
                    required: false,
                },
                {
                    name: "aria-label",
                    description: "The aria-label attribute",
                    type: DataType.string,
                    default: false,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
            ],
        },
    ],
};
