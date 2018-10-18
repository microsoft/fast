import * as React from "react";
import HorizontalOverflow, {
    HorizontalOverflowHandledProps,
    HorizontalOverflowManagedClasses,
    HorizontalOverflowUnhandledProps
} from "./horizontal-overflow";
import schema from "./horizontal-overflow.schema.json";
import Documentation from "./.tmp/documentation";
import ButtonSchema from "../button/button.schema.json";
import ImageSchema from "../image/image.schema.json";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const classes: HorizontalOverflowManagedClasses = {
    managedClasses: {
        horizontalOverflow: "horizontal-overflow",
        horizontalOverflow_contentRegion: "horizontal-overflow_items",
        horizontalOverflow_next: "horizontal-overflow_next",
        horizontalOverflow_previous: "horizontal-overflow_previous"
    }
};

const images: any[] = [
    {
        id: ImageSchema.id,
        props: {
            managedClasses: {
                image: "image"
            },
            src: "https://placehold.it/120x100/414141/?text=1",
            alt: "placeholder image"
        }
    },
    {
        id: ImageSchema.id,
        props: {
            managedClasses: {
                image: "image"
            },
            src: "https://placehold.it/180x100?text=2",
            alt: "placeholder image"
        }
    },
    {
        id: ImageSchema.id,
        props: {
            managedClasses: {
                image: "image"
            },
            src: "https://placehold.it/240x100/414141/?text=3",
            alt: "placeholder image"
        }
    },
    {
        id: ImageSchema.id,
        props: {
            managedClasses: {
                image: "image"
            },
            src: "https://placehold.it/120x100?text=4",
            alt: "placeholder image"
        }
    },
    {
        id: ImageSchema.id,
        props: {
            managedClasses: {
                image: "image"
            },
            src: "https://placehold.it/140x100/414141/?text=5",
            alt: "placeholder image"
        }
    },
    {
        id: ImageSchema.id,
        props: {
            managedClasses: {
                image: "image"
            },
            src: "https://placehold.it/200x100?text=6",
            alt: "placeholder image"
        }
    },
    {
        id: ImageSchema.id,
        props: {
            managedClasses: {
                image: "image"
            },
            src: "https://placehold.it/220x100/414141/?text=7",
            alt: "placeholder image"
        }
    },
    {
        id: ImageSchema.id,
        props: {
            managedClasses: {
                image: "image"
            },
            src: "https://placehold.it/170x100?text=8",
            alt: "placeholder image"
        }
    },
    {
        id: ImageSchema.id,
        props: {
            managedClasses: {
                image: "image"
            },
            src: "https://placehold.it/160x100/414141/?text=9",
            alt: "placeholder image"
        }
    },
    {
        id: ImageSchema.id,
        props: {
            managedClasses: {
                image: "image"
            },
            src: "https://placehold.it/160x100/414141/?text=9",
            alt: "placeholder image"
        }
    },
    {
        id: ImageSchema.id,
        props: {
            managedClasses: {
                image: "image"
            },
            src: "https://placehold.it/240x100?text=10",
            alt: "placeholder image"
        }
    },
    {
        id: ImageSchema.id,
        props: {
            managedClasses: {
                image: "image"
            },
            src: "https://placehold.it/110x100/414141/?text=11",
            alt: "placeholder image"
        }
    },
    {
        id: ImageSchema.id,
        props: {
            managedClasses: {
                image: "image"
            },
            src: "https://placehold.it/270x100?text=12",
            alt: "placeholder image"
        }
    }
];

const examples: ComponentFactoryExample<HorizontalOverflowHandledProps> = {
    name: "Horizontal overflow",
    component: HorizontalOverflow,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...classes,
        children: [
            {
                id: ButtonSchema.id,
                props: {
                    managedClasses: {
                        button: "button"
                    },
                    slot: "previous",
                    children: "previous"
                }
            },
            {
                id: ButtonSchema.id,
                props: {
                    managedClasses: {
                        button: "button"
                    },
                    slot: "next",
                    children: "next"
                }
            },
            ...images
        ]
    },
    data: [
        {
            ...classes,
            children: [
                {
                    id: ButtonSchema.id,
                    props: {
                        managedClasses: {
                            button: "button"
                        },
                        slot: "previous",
                        children: "previous"
                    }
                },
                {
                    id: ButtonSchema.id,
                    props: {
                        managedClasses: {
                            button: "button"
                        },
                        slot: "next",
                        children: "next"
                    }
                },
                ...images
            ]
        },
        {
            ...classes,
            children: [
                {
                    id: ButtonSchema.id,
                    props: {
                        managedClasses: {
                            button: "button"
                        },
                        slot: "next",
                        children: "next"
                    }
                },
                ...images
            ]
        },
        {
            ...classes,
            children: [
                {
                    id: ButtonSchema.id,
                    props: {
                        managedClasses: {
                            button: "button"
                        },
                        slot: "previous",
                        children: "previous"
                    }
                },
                ...images
            ]
        },
        {
            ...classes,
            children: [...images]
        },
        {
            ...classes
        }
    ]
};

export default examples;
