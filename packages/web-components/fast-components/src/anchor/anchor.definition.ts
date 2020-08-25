import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastAnchorDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-anchor",
            description: "The FAST anchor element",
            attributes: [
                {
                    name: "appearance",
                    description: "The appearance attribute",
                    type: DataType.string,
                    values: [
                        {
                            name: "accent",
                        },
                        {
                            name: "lightweight",
                        },
                        {
                            name: "neutral",
                        },
                        {
                            name: "outline",
                        },
                        {
                            name: "stealth",
                        },
                        {
                            name: "hypertext",
                        },
                    ],
                    default: "neutral",
                    required: false,
                },
                {
                    name: "download",
                    description: "The download attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "href",
                    description: "The href attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "hreflang",
                    description: "The hreflang attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "ping",
                    description: "The ping attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "referrerpolicy",
                    description: "The referrerpolicy attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "rel",
                    description: "The rel attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "target",
                    description: "The target attribute",
                    type: DataType.string,
                    default: "_self",
                    values: [
                        {
                            name: "_self",
                        },
                        {
                            name: "_blank",
                        },
                        {
                            name: "_parent",
                        },
                        {
                            name: "_top",
                        },
                    ],
                    required: false,
                },
                {
                    name: "type",
                    description: "The type attribute",
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
                    name: "start",
                    description: "The start slot",
                },
                {
                    name: "end",
                    description: "The end slot",
                },
            ],
        },
    ],
};
