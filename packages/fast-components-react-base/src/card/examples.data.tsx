import React from "react";
import Card, {
    CardHandledProps,
    CardManagedClasses,
    CardProps,
    CardUnhandledProps,
} from "./card";
import { cardSchema, imageSchema } from "../index";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const managedClasses: CardManagedClasses = {
    managedClasses: {
        card: "card",
    },
};

const examples: ComponentFactoryExample<CardProps> = {
    name: "Card",
    component: Card,
    schema: cardSchema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        children: [
            {
                id: imageSchema.id,
                props: {
                    managedClasses: {
                        image: "image",
                    },
                    src: "https://placehold.it/300x500/414141",
                    alt: "placeholder image",
                },
            },
        ],
    },
    data: [
        {
            ...managedClasses,
            children: [
                {
                    id: imageSchema.id,
                    props: {
                        managedClasses: {
                            image: "image",
                        },
                        src: "https://placehold.it/300x500/414141",
                        alt: "placeholder image",
                    },
                },
            ],
        },
    ],
};

export default examples;
