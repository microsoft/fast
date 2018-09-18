import * as React from "react";
import HorizontalOverflow, {
    IHorizontalOverflowHandledProps,
    IHorizontalOverflowManagedClasses,
    IHorizontalOverflowUnhandledProps
} from "./horizontal-overflow";
import schema from "./horizontal-overflow.schema.json";
import Documentation from "./.tmp/documentation";
import Button from "../button";
import Image from "../image";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const classes: IHorizontalOverflowManagedClasses = {
    managedClasses: {
        horizontalOverflow: "horizontal-overflow",
        horizontalOverflow_contentRegion: "horizontal-overflow_items",
        horizontalOverflow_next: "horizontal-overflow_next",
        horizontalOverflow_previous: "horizontal-overflow_previous"
    }
};

const images: JSX.Element[] = [
    (<Image managedClasses={{image: "image"}} src="https://placehold.it/120x100/414141/?text=1" alt="placeholder image" />),
    (<Image managedClasses={{image: "image"}} src="https://placehold.it/180x100?text=2" alt="placeholder image" />),
    (<Image managedClasses={{image: "image"}} src="https://placehold.it/240x100/414141/?text=3" alt="placeholder image" />),
    (<Image managedClasses={{image: "image"}} src="https://placehold.it/120x100?text=4" alt="placeholder image" />),
    (<Image managedClasses={{image: "image"}} src="https://placehold.it/140x100/414141/?text=5" alt="placeholder image" />),
    (<Image managedClasses={{image: "image"}} src="https://placehold.it/200x100?text=6" alt="placeholder image" />),
    (<Image managedClasses={{image: "image"}} src="https://placehold.it/220x100/414141/?text=7" alt="placeholder image" />),
    (<Image managedClasses={{image: "image"}} src="https://placehold.it/170x100?text=8" alt="placeholder image" />),
    (<Image managedClasses={{image: "image"}} src="https://placehold.it/160x100/414141/?text=9" alt="placeholder image" />),
    (<Image managedClasses={{image: "image"}} src="https://placehold.it/240x100?text=10" alt="placeholder image" />),
    (<Image managedClasses={{image: "image"}} src="https://placehold.it/110x100/414141/?text=11" alt="placeholder image" />),
    (<Image managedClasses={{image: "image"}} src="https://placehold.it/270x100?text=12" alt="placeholder image" />)
];

const examples: IComponentFactoryExample<IHorizontalOverflowHandledProps & IHorizontalOverflowManagedClasses> = {
    name: "Horizontal overflow",
    component: HorizontalOverflow,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...classes,
        children: [
            (<Button managedClasses={{button: "button"}} slot="previous">previous</Button>),
            (<Button managedClasses={{button: "button"}} slot="next">next</Button>),
            ...images
        ]
    },
    data: [
        {
            ...classes,
            children: [
                (<Button managedClasses={{button: "button"}} slot="previous">previous</Button>),
                (<Button managedClasses={{button: "button"}} slot="next">next</Button>),
                ...images
            ]
        },
        {
            ...classes,
            children: [
                (<Button managedClasses={{button: "button"}} slot="next">next</Button>),
                ...images
            ]
        },
        {
            ...classes,
            children: [
                (<Button managedClasses={{button: "button"}} slot="previous">previous</Button>),
                ...images
            ]
        },
        {
            ...classes,
            children: [
                ...images
            ]
        },
        {
            ...classes
        }
    ]
};

export default examples;
