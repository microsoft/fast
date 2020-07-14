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
                    name: "notTabbedPattern",
                    description: "The nottabbedpattern attribute",
                    type: DataType.boolean,
                    default: false,
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
                    name: "activeid",
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
            ],
            slots: [
                {
                    name: "",
                    description: "The default slot",
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
