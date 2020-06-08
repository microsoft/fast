import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastCarouselDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-carousel",
            description: "The FAST Carousel element",
            attributes: [
                {
                    name: "autoplay",
                    type: DataType.boolean,
                    description: "The autoplay attribute",
                    default: true,
                    required: false,
                },
                {
                    name: "loop",
                    description: "The loop attribute",
                    type: DataType.boolean,
                    default: true,
                    required: false,
                },
                {
                    name: "paused",
                    description: "The paused attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "pattern",
                    description:
                        "The pattern attribute controlling if the carousel uses the Tabbed or Basic ARIA pattern",
                    type: DataType.string,
                    values: [
                        {
                            name: "basic",
                        },
                        {
                            name: "tabbed",
                        },
                    ],
                    default: "tabbed",
                    required: false,
                },
                {
                    name: "autoplay-interval",
                    description: "The autoplay-interval attribute",
                    type: DataType.number,
                    default: 6000,
                    required: false,
                },
                {
                    name: "active-slide-id",
                    description: "The activeid attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "aria-labelledby",
                    description: "The aria-labelledby attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "aria-label",
                    description: "The aria-labelledby attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "previous-button-aria-label",
                    description:
                        "The aria-label for the default slotted content of previous button",
                    type: DataType.string,
                    default: "previous button",
                    required: false,
                },
                {
                    name: "next-button-aria-label",
                    description:
                        "The aria-label for the default slotted content of next button",
                    type: DataType.string,
                    default: "next button",
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    description: "The default slot used in the basic pattern",
                },
                {
                    name: "tab",
                    description: "The slot for the tabs used in the tabbed patten",
                },
                {
                    name: "tabpanel",
                    description: "The slot for the tabpanels used in the tabbed pattern",
                },
                {
                    name: "rotation-control",
                    description: "The rotation control slot for the pause/play button",
                },
                {
                    name: "previous-button",
                    description: "The control slot for the previous slide button",
                },
                {
                    name: "next-button",
                    description: "The control slot for the next slide button",
                },
            ],
        },
    ],
};
