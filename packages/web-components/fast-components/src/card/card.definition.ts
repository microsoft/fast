import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastCardDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-card",
            title: "Card",
            description: "The FAST card element",
            attributes: [
                {
                    name: "background-color",
                    title: "Background color",
                    description:
                        "An instance of the Design System Provider background color",
                    type: DataType.string,
                    default: "",
                    required: false,
                },
                {
                    name: "card-background-color",
                    title: "Card background color",
                    description:
                        "Background color for the card which sets the context for the design system",
                    type: DataType.string,
                    default: "",
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The content of the card",
                },
            ],
        },
    ],
};
