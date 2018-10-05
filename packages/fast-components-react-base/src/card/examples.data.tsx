import * as React from "react";
import Card, { CardHandledProps, CardManagedClasses, CardProps, CardUnhandledProps } from "./card";
import schema from "./card.schema.json";
import ImageSchema from "../image/image.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const managedClasses: CardManagedClasses = {
    managedClasses: {
        card: "card"
    },
};

const examples: ComponentFactoryExample<CardProps> = {
    name: "Card",
    component: Card,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        children: [
            {
                id: ImageSchema.id,
                props: {
                    managedClasses: {
                        image: "image"
                    },
                    src: "https://placehold.it/300x500/414141",
                    alt: "placeholder image"
                }
            }
        ]
    },
    data: [
        {
            ...managedClasses,
            children: [
                {
                    id: ImageSchema.id,
                    props: {
                        managedClasses: {
                            image: "image"
                        },
                        src: "https://placehold.it/300x500/414141",
                        alt: "placeholder image"
                    }
                }
            ]
        }
    ]
};

export default examples;
