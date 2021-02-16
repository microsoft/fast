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
                    type: DataType.boolean,
                    description: "The disabled attribute",
                    default: true,
                    required: false,
                },
                {
                    name: "aria-hidden",
                    type: DataType.boolean,
                    description: "The aria-hidden attribute",
                    default: true,
                    required: false,
                },
                {
                    name: "direction",
                    type: DataType.string,
                    description: "The direction attribute",
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
