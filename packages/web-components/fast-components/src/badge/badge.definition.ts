import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastBadgeDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-badge",
            title: "Badge",
            description: "The FAST badge element",
            attributes: [
                {
                    name: "circular",
                    title: "Circular",
                    description: "Sets the visual appearance of the badge to circular",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "fill",
                    title: "Fill",
                    description:
                        "Sets the background color to a CSS custom property of the attribute value - var(--badge-fill-[value])",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "color",
                    title: "Color",
                    description:
                        "Sets the color to a CSS custom property of the attribute value - var(--badge-fill-[value])",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The content of the badge",
                },
            ],
        },
    ],
};
