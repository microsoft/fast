import { Data } from "@microsoft/fast-tooling";
import {
    accentButtonSchema2,
    badgeSchema2,
    callToActionSchema2,
    cardSchema2,
    checkboxSchema2,
    dividerSchema,
    headingSchema2,
    hypertextSchema2,
    imageSchema,
    labelSchema2,
    lightweightButtonSchema2,
    neutralButtonSchema2,
    numberFieldSchema,
    outlineButtonSchema2,
    paragraphSchema2,
    progressSchema2,
    stealthButtonSchema2,
    subheadingSchema2,
    textAreaSchema,
    toggleSchema2,
    typographySchema2,
} from "@microsoft/fast-components-react-msft";
import { textSchema } from "./";

interface ExampleData {
    [key: string]: Array<Data<unknown>>;
}

const exampleData: ExampleData = {
    [accentButtonSchema2.id]: [
        {
            schemaId: accentButtonSchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data: "Button",
                    dataLocation: "children",
                },
            ],
        },
    ],
    [badgeSchema2.id]: [
        {
            schemaId: badgeSchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data: "LOREM",
                    dataLocation: "children",
                },
            ],
        },
    ],
    [cardSchema2.id]: [
        {
            schemaId: cardSchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: imageSchema.id,
                    data: {
                        src: "http://placehold.it/300x160",
                    },
                    dataLocation: "children",
                },
                {
                    schemaId: badgeSchema2.id,
                    data: {},
                    dataLocation: "children",
                    linkedData: [
                        {
                            schemaId: textSchema.id,
                            data: "LOREM",
                            dataLocation: "children",
                        },
                    ],
                },
                {
                    schemaId: headingSchema2.id,
                    data: {
                        size: 3,
                    },
                    dataLocation: "children",
                    linkedData: [
                        {
                            schemaId: textSchema.id,
                            data: "Lorem ipsum sit amet",
                            dataLocation: "children",
                        },
                    ],
                },
                {
                    schemaId: paragraphSchema2.id,
                    data: {},
                    dataLocation: "children",
                    linkedData: [
                        {
                            schemaId: textSchema.id,
                            data:
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fermentum tortor neque, vel lacinia sem viverra quis.",
                            dataLocation: "children",
                        },
                    ],
                },
                {
                    schemaId: callToActionSchema2.id,
                    data: {
                        appearance: "justified",
                    },
                    dataLocation: "children",
                    linkedData: [
                        {
                            schemaId: textSchema.id,
                            data: "Call to action",
                            dataLocation: "children",
                        },
                    ],
                },
            ],
        },
    ],
    [checkboxSchema2.id]: [
        {
            schemaId: checkboxSchema2.id,
            data: {},
            dataLocation: "children",
        },
    ],
    [callToActionSchema2.id]: [
        {
            schemaId: callToActionSchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data: "Call to action",
                    dataLocation: "children",
                },
            ],
        },
    ],
    [dividerSchema.id]: [
        {
            schemaId: dividerSchema.id,
            data: {},
            dataLocation: "children",
        },
    ],
    [headingSchema2.id]: [
        {
            schemaId: headingSchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data: "Lorem ipsum",
                    dataLocation: "children",
                },
            ],
        },
    ],
    [hypertextSchema2.id]: [
        {
            schemaId: hypertextSchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data: "Hypertext",
                    dataLocation: "children",
                },
            ],
        },
    ],
    [imageSchema.id]: [
        {
            schemaId: imageSchema.id,
            data: {},
            dataLocation: "children",
        },
    ],
    [labelSchema2.id]: [
        {
            schemaId: labelSchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data: "Label",
                    dataLocation: "children",
                },
            ],
        },
    ],
    [lightweightButtonSchema2.id]: [
        {
            schemaId: lightweightButtonSchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data: "Button",
                    dataLocation: "children",
                },
            ],
        },
    ],
    [neutralButtonSchema2.id]: [
        {
            schemaId: neutralButtonSchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data: "Button",
                    dataLocation: "children",
                },
            ],
        },
    ],
    [numberFieldSchema.id]: [
        {
            schemaId: numberFieldSchema.id,
            data: {},
            dataLocation: "children",
        },
    ],
    [outlineButtonSchema2.id]: [
        {
            schemaId: outlineButtonSchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data: "Button",
                    dataLocation: "children",
                },
            ],
        },
    ],
    [paragraphSchema2.id]: [
        {
            schemaId: paragraphSchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fermentum tortor neque, vel lacinia sem viverra quis. Praesent feugiat placerat semper. Vestibulum vestibulum hendrerit ex, vitae venenatis ipsum vestibulum vitae. Maecenas rutrum, enim vitae volutpat blandit, tellus nunc mattis ante, nec semper massa ipsum quis urna. Nunc aliquam lectus ut ex cursus interdum. Aenean eget varius metus. Duis interdum, erat sed dignissim sagittis, elit risus commodo urna, pretium dictum nisi lorem non quam.",
                    dataLocation: "children",
                },
            ],
        },
    ],
    [progressSchema2.id]: [
        {
            schemaId: progressSchema2.id,
            data: {},
            dataLocation: "children",
        },
    ],
    [stealthButtonSchema2.id]: [
        {
            schemaId: stealthButtonSchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data: "Button",
                    dataLocation: "children",
                },
            ],
        },
    ],
    [subheadingSchema2.id]: [
        {
            schemaId: subheadingSchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data: "Lorem ipsum sit amet.",
                    dataLocation: "children",
                },
            ],
        },
    ],
    [textAreaSchema.id]: [
        {
            schemaId: textAreaSchema.id,
            data: {},
            dataLocation: "children",
        },
    ],
    [toggleSchema2.id]: [
        {
            schemaId: toggleSchema2.id,
            data: {},
            dataLocation: "children",
        },
    ],
    [typographySchema2.id]: [
        {
            schemaId: typographySchema2.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data: "Lorem ipsum sit amet.",
                    dataLocation: "children",
                },
            ],
        },
    ],
    [textSchema.id]: [
        {
            schemaId: textSchema.id,
            data: {},
            dataLocation: "children",
            linkedData: [
                {
                    schemaId: textSchema.id,
                    data: "Lorem ipsum",
                    dataLocation: "children",
                },
            ],
        },
    ],
};

export { exampleData };
