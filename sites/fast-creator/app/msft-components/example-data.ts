import { Data } from "@microsoft/fast-tooling";
import {
    accentButtonSchema,
    badgeSchema,
    callToActionSchema,
    cardSchema,
    checkboxSchema,
    dividerSchema,
    headingSchema,
    hypertextSchema,
    imageSchema,
    labelSchema,
    lightweightButtonSchema,
    neutralButtonSchema,
    numberFieldSchema,
    outlineButtonSchema,
    paragraphSchema,
    progressSchema,
    stealthButtonSchema,
    subheadingSchema,
    textAreaSchema,
    textSchema,
    toggleSchema,
    typographySchema,
} from "./";

export interface LinkedDataStack {
    dataLocation: string;
    data: Array<Data<unknown>>;
}

interface ExampleData {
    [key: string]: ExampleDataItems;
}

interface ExampleDataItems {
    props: any;
    linkedData?: LinkedDataStack;
}

const exampleData: ExampleData = {
    [accentButtonSchema.id]: {
        props: {},
        linkedData: {
            dataLocation: "children",
            data: [
                {
                    schemaId: textSchema.id,
                    data: "Button",
                },
            ],
        },
    },
    [badgeSchema.id]: {
        props: {},
        linkedData: {
            dataLocation: "children",
            data: [
                {
                    schemaId: textSchema.id,
                    data: "LOREM",
                },
            ],
        },
    },
    [cardSchema.id]: {
        props: {},
    },
    [checkboxSchema.id]: {
        props: {},
    },
    [callToActionSchema.id]: {
        props: {},
        linkedData: {
            dataLocation: "children",
            data: [
                {
                    schemaId: textSchema.id,
                    data: "Call to action",
                },
            ],
        },
    },
    [dividerSchema.id]: {
        props: {},
    },
    [headingSchema.id]: {
        props: {},
        linkedData: {
            dataLocation: "children",
            data: [
                {
                    schemaId: textSchema.id,
                    data: "Lorem ipsum",
                },
            ],
        },
    },
    [hypertextSchema.id]: {
        props: {},
        linkedData: {
            dataLocation: "children",
            data: [
                {
                    schemaId: textSchema.id,
                    data: "Hypertext",
                },
            ],
        },
    },
    [imageSchema.id]: {
        props: {},
    },
    [labelSchema.id]: {
        props: {},
        linkedData: {
            dataLocation: "children",
            data: [
                {
                    schemaId: textSchema.id,
                    data: "Label",
                },
            ],
        },
    },
    [lightweightButtonSchema.id]: {
        props: {},
        linkedData: {
            dataLocation: "children",
            data: [
                {
                    schemaId: textSchema.id,
                    data: "Button",
                },
            ],
        },
    },
    [neutralButtonSchema.id]: {
        props: {},
        linkedData: {
            dataLocation: "children",
            data: [
                {
                    schemaId: textSchema.id,
                    data: "Button",
                },
            ],
        },
    },
    [numberFieldSchema.id]: {
        props: {},
    },
    [outlineButtonSchema.id]: {
        props: {},
        linkedData: {
            dataLocation: "children",
            data: [
                {
                    schemaId: textSchema.id,
                    data: "Button",
                },
            ],
        },
    },
    [paragraphSchema.id]: {
        props: {},
        linkedData: {
            dataLocation: "children",
            data: [
                {
                    schemaId: textSchema.id,
                    data:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fermentum tortor neque, vel lacinia sem viverra quis. Praesent feugiat placerat semper. Vestibulum vestibulum hendrerit ex, vitae venenatis ipsum vestibulum vitae. Maecenas rutrum, enim vitae volutpat blandit, tellus nunc mattis ante, nec semper massa ipsum quis urna. Nunc aliquam lectus ut ex cursus interdum. Aenean eget varius metus. Duis interdum, erat sed dignissim sagittis, elit risus commodo urna, pretium dictum nisi lorem non quam.",
                },
            ],
        },
    },
    [progressSchema.id]: {
        props: {},
    },
    [stealthButtonSchema.id]: {
        props: {},
        linkedData: {
            dataLocation: "children",
            data: [
                {
                    schemaId: textSchema.id,
                    data: "Button",
                },
            ],
        },
    },
    [subheadingSchema.id]: {
        props: {},
        linkedData: {
            dataLocation: "children",
            data: [
                {
                    schemaId: textSchema.id,
                    data: "Lorem ipsum sit amet.",
                },
            ],
        },
    },
    [textAreaSchema.id]: {
        props: {},
    },
    [toggleSchema.id]: {
        props: {},
    },
    [typographySchema.id]: {
        props: {},
        linkedData: {
            dataLocation: "children",
            data: [
                {
                    schemaId: textSchema.id,
                    data: "Lorem ipsum sit amet.",
                },
            ],
        },
    },
    [textSchema.id]: {
        props: "Lorem ipsum",
    },
};

export { exampleData };
