import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { AxisPositioningMode } from "@microsoft/fast-foundation";

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
                // {
                //     name: "horizontal-positioning-mode",
                //     description: "The horizontal-positioning-mode attribute",
                //     type: DataType.string,
                //     values: [
                //         { name: AxisPositioningMode.uncontrolled },
                //         { name: AxisPositioningMode.locktodefault },
                //         { name: AxisPositioningMode.dynamic },
                //     ],
                //     default: true,
                //     required: false,
                // },
            ],
            slots: [],
        },
    ],
};
