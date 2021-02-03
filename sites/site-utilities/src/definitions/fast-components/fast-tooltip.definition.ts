import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastTooltipDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-tooltip",
            description: "The FAST tooltip element",
            attributes: [
                {
                    name: "visible",
                    description: "The visible attribute",
                    type: DataType.boolean,
                    default: undefined,
                    required: false,
                },
                {
                    name: "anchor",
                    description: "The anchor attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "delay",
                    description: "The delay attribute",
                    type: DataType.number,
                    default: 300,
                    required: false,
                },
                {
                    name: "position",
                    description: "The position attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                    values: [
                        {
                            name: "top",
                        },
                        {
                            name: "right",
                        },
                        {
                            name: "bottom",
                        },
                        {
                            name: "left",
                        },
                    ],
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
