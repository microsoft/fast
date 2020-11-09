import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { PopoverPosition } from "@microsoft/fast-foundation/src/popover";

export const fastPopoverDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-popover",
            description: "The FAST popover element",
            attributes: [
                {
                    name: "visible",
                    description: "The visible attribute",
                    type: DataType.boolean,
                    default: undefined,
                    required: false,
                },
                {
                    name: "trap-focus",
                    description: "The trap focus attribute",
                    type: DataType.boolean,
                    default: true,
                    required: false,
                },
                {
                    name: "target",
                    description:
                        "The target attribute as the string ID of the element the popover is anchored to",
                    type: DataType.string,
                    default: undefined,
                    required: true,
                },
                {
                    name: "position",
                    description: "The position attribute",
                    values: [
                        { name: PopoverPosition.top },
                        { name: PopoverPosition.right },
                        { name: PopoverPosition.bottom },
                        { name: PopoverPosition.left },
                    ],
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "delay",
                    description: "The delay attribute",
                    type: DataType.number,
                    default: 0,
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
