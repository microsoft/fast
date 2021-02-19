import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { FlipperDirection } from "@microsoft/fast-foundation/dist/esm/flipper/flipper.options";

export const fastFlipperDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-flipper",
            title: "Flipper",
            description: "The FAST flipper element",
            attributes: [
                {
                    name: "disabled",
                    title: "Disabled",
                    type: DataType.boolean,
                    description: "Sets the disabled state of the flipper",
                    default: true,
                    required: false,
                },
                {
                    name: "aria-hidden",
                    title: "ARIA hidden",
                    type: DataType.boolean,
                    description:
                        "Flippers are often a duplicate method of navigation, so by default they are hidden from assistive technology (AT). When set to true, the element is exposed to AT",
                    default: true,
                    required: false,
                },
                {
                    name: "direction",
                    type: DataType.string,
                    title: "Direction",
                    description: "The navigation direction of the flipper",
                    values: [
                        {
                            name: FlipperDirection.previous,
                        },
                        {
                            name: FlipperDirection.next,
                        },
                    ],
                    default: FlipperDirection.next,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "previous",
                    title: "Previous slot",
                    description:
                        "Slot to provide a custom icon to represent the 'previous' flipper state",
                },
                {
                    name: "next",
                    title: "Next slot",
                    description:
                        "Slot to provide a custom icon to represent the 'next' flipper state",
                },
            ],
        },
    ],
};
