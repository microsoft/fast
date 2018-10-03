import * as React from "react";
import Card, { CardProps, ICardHandledProps, ICardManagedClasses, ICardUnhandledProps } from "./card";
import schema from "./card.schema.json";
import ImageSchema from "../image/image.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const managedClasses: ICardManagedClasses = {
    managedClasses: {
        card: "card"
    },
};

const examples: IComponentFactoryExample<CardProps> = {
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
