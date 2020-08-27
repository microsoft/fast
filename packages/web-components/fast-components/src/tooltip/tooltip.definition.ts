import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { observable } from '@microsoft/fast-element';
import { TooltipPosition } from "@microsoft/fast-foundation"

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
                    description: "The default slot",
                },
            ],
        },
    ],
};
