import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastAccordionDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-accordion",
            title: "Accordion",
            description: "The FAST accordion element",
            attributes: [
                {
                    name: "expand-mode",
                    title: "Expand mode",
                    description: "The expand mode attribute",
                    type: DataType.string,
                    values: [
                        {
                            name: "single",
                        },
                        {
                            name: "multi",
                        },
                    ],
                    default: "multi",
                    required: false,
                },
            ],
            slots: [
                {
                    name: "item",
                    title: "Item slot",
                    description: "The default slot for accordion items",
                },
            ],
        },
    ],
};
