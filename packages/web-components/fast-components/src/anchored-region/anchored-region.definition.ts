import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
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
            description: "The FAST anchored region element",
            attributes: [
                {
                    name: "anchor",
                    type: DataType.string,
                    description: "The anchor attribute",
                    default: undefined,
                    required: true,
                },
                {
                    name: "viewport",
                    description: "The viewport attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "horizontal-positioning-mode",
                    description: "The horizontal-positioning-mode attribute",
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
                    description: "The horizontal-default-position attribute",
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
                    description: "The horizontal-inset attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "horizontal-threshold",
                    description: "The horizontal-threshold attribute",
                    type: DataType.number,
                    default: undefined,
                    required: false,
                },
                {
                    name: "horizontal-scaling",
                    description: "The horizontal-scaling attribute",
                    type: DataType.string,
                    values: [{ name: "anchor" }, { name: "fill" }, { name: "content" }],
                    default: "content",
                    required: false,
                },

                {
                    name: "vertical-positioning-mode",
                    description: "The vertical-positioning-mode attribute",
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
                    description: "The vertical-default-position attribute",
                    type: DataType.string,
                    values: [{ name: "top" }, { name: "bottom" }, { name: "unset" }],
                    default: "unset",
                    required: false,
                },
                {
                    name: "vertical-inset",
                    description: "The vertical-inset attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "vertical-threshold",
                    description: "The vertical-threshold attribute",
                    type: DataType.number,
                    default: undefined,
                    required: false,
                },
                {
                    name: "vertical-scaling",
                    description: "The vertical-scaling attribute",
                    type: DataType.string,
                    values: [{ name: "anchor" }, { name: "fill" }, { name: "content" }],
                    default: "content",
                    required: false,
                },
                {
                    name: "fixed-placement",
                    description: "The fixed-placement attribute",
                    type: DataType.boolean,
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
