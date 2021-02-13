import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { TooltipPosition } from "@microsoft/fast-foundation/dist/esm/tooltip/tooltip.options";

export const fastTooltipDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-tooltip",
            title: "Tooltip",
            description: "The FAST tooltip element",
            attributes: [
                {
                    name: "visible",
                    title: "Visible",
                    description: "Sets whether the tooltip is visible or not",
                    type: DataType.boolean,
                    default: undefined,
                    required: false,
                },
                {
                    name: "anchor",
                    title: "Anchor",
                    description:
                        "The HTML id of the element the region is positioned relative to",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "delay",
                    title: "Delay",
                    description:
                        "The delay in milliseconds before a tooltip is shown after a hover event",
                    type: DataType.number,
                    default: 300,
                    required: false,
                },
                {
                    name: "position",
                    title: "Position",
                    description:
                        "Controls the placement of the tooltip relative to the anchor",
                    values: [
                        { name: TooltipPosition.top },
                        { name: TooltipPosition.right },
                        { name: TooltipPosition.bottom },
                        { name: TooltipPosition.left },
                        { name: TooltipPosition.start },
                        { name: TooltipPosition.end },
                    ],
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The tooltip content",
                },
            ],
        },
    ],
};
