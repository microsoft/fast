import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastAnchorDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-anchor",
            title: "Anchor",
            description: "The FAST anchor element",
            attributes: [
                {
                    name: "appearance",
                    title: "Appearance",
                    description: "The anchor's visual treatment",
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
                    title: "Download",
                    description: "The HTML download attribute of the anchor",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "href",
                    title: "Href",
                    description: "The HTML href attribute of the anchor",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "hreflang",
                    title: "Hreflang",
                    description: "The HTML hreflang attribute of the anchor",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "ping",
                    title: "Ping",
                    description: "The HTML ping attribute of the anchor",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "referrerpolicy",
                    title: "Referrerpolicy",
                    description: "The HTML referrerpolicy attribute of the anchor",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "rel",
                    title: "Rel",
                    description: "The HTML rel attribute of the anchor",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "target",
                    title: "Target",
                    description: "The HTML target attribute of the anchor",
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
                    title: "Type",
                    description: "The HTML type attribute of the anchor",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The content of the anchor",
                },
                {
                    name: "start",
                    title: "Start slot",
                    description:
                        "Contents of the start slot are positioned before the anchor content",
                },
                {
                    name: "end",
                    title: "End slot",
                    description:
                        "Contents of the end slot are positioned after the anchor content",
                },
            ],
        },
    ],
};
