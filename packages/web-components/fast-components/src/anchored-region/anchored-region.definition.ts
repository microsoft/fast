import type { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import {
    AxisPositioningMode,
    AxisScalingMode,
    HorizontalPosition,
    VerticalPosition,
} from "@microsoft/fast-foundation";

export const fastAnchoredRegionDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-anchored-region",
            title: "Anchored region",
            description: "The FAST anchored region element",
            attributes: [
                {
                    name: "anchor",
                    title: "Anchor ID",
                    type: DataType.string,
                    description:
                        "The HTML ID of the element the region is positioned relative to",
                    default: undefined,
                    required: true,
                },
                {
                    name: "viewport",
                    title: "Viewport ID",
                    description:
                        "The HTML ID of the viewport the region is positioned relative to",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "horizontal-positioning-mode",
                    title: "Horizontal positioning mode",
                    description: "How the horizontal placement is determined",
                    type: DataType.string,
                    values: [
                        { name: "uncontrolled" },
                        { name: "locktodefault" },
                        { name: "dynamic" },
                    ],
                    default: "uncontrolled",
                    required: false,
                },
                {
                    name: "horizontal-default-position",
                    title: "Horizontal default position",
                    description:
                        "The default horizontal position of the region relative to the configured 'Anchor ID'",
                    type: DataType.string,
                    values: [
                        { name: "start" },
                        { name: "end" },
                        { name: "left" },
                        { name: "right" },
                        { name: "unset" },
                    ],
                    default: "unset",
                    required: false,
                },
                {
                    name: "horizontal-inset",
                    title: "Horizontal inset",
                    description:
                        "Determines whether the region should overlap the anchor on the horizontal axis",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "horizontal-threshold",
                    title: "Horizontal threshold",
                    description:
                        "The space allocated to the default position before the widest area is selected for layout",
                    type: DataType.number,
                    default: undefined,
                    required: false,
                },
                {
                    name: "horizontal-scaling",
                    title: "Horizontal scaling",
                    description: "Defines how the width of the region is calculated",
                    type: DataType.string,
                    values: [{ name: "anchor" }, { name: "fill" }, { name: "content" }],
                    default: "content",
                    required: false,
                },
                {
                    name: "vertical-positioning-mode",
                    title: "Vertical positioning mode",
                    description: "How the vertical placement is determined",
                    type: DataType.string,
                    values: [
                        { name: "uncontrolled" },
                        { name: "locktodefault" },
                        { name: "dynamic" },
                    ],
                    default: "uncontrolled",
                    required: false,
                },
                {
                    name: "vertical-default-position",
                    title: "Vertical default position",
                    description:
                        "The default vertical position of the region relative to the configured 'Anchor ID'",
                    type: DataType.string,
                    values: [{ name: "top" }, { name: "bottom" }, { name: "unset" }],
                    default: "unset",
                    required: false,
                },
                {
                    name: "vertical-inset",
                    title: "Vertical inset",
                    description:
                        "Determines whether the region should overlap the anchor on the vertical axis",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "vertical-threshold",
                    title: "Vertical threshold",
                    description:
                        "The space allocated to the default position before the widest area is selected for layout",
                    type: DataType.number,
                    default: undefined,
                    required: false,
                },
                {
                    name: "vertical-scaling",
                    title: "Vertical scaling",
                    description: "Defines how the width of the region is calculated",
                    type: DataType.string,
                    values: [{ name: "anchor" }, { name: "fill" }, { name: "content" }],
                    default: "content",
                    required: false,
                },
                {
                    name: "fixed-placement",
                    title: "Fixed placement",
                    description:
                        "Fixed placement allows the region to break out of parent containers",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "auto-update-mode",
                    title: "Auto update mode",
                    description:
                        "Defines whether the component automatically updates its position",
                    type: DataType.string,
                    values: [{ name: "anchor" }, { name: "auto" }],
                    default: "anchor",
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The content of the anchored region",
                },
            ],
        },
    ],
};
