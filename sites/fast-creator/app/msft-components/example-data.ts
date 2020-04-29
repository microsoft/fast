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
import { textSchema } from "./index";

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
    [accentButtonSchema2.id]: {
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
    [badgeSchema2.id]: {
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
    [cardSchema2.id]: {
        props: {},
    },
    [checkboxSchema2.id]: {
        props: {},
    },
    [callToActionSchema2.id]: {
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
    [headingSchema2.id]: {
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
    [hypertextSchema2.id]: {
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
    [labelSchema2.id]: {
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
    [lightweightButtonSchema2.id]: {
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
    [neutralButtonSchema2.id]: {
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
    [outlineButtonSchema2.id]: {
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
    [paragraphSchema2.id]: {
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
    [progressSchema2.id]: {
        props: {},
    },
    [stealthButtonSchema2.id]: {
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
    [subheadingSchema2.id]: {
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
    [toggleSchema2.id]: {
        props: {},
    },
    [typographySchema2.id]: {
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
