import React from "react";
import { Card } from "./index";
import {
    CardHandledProps,
    CardProps,
    cardSchema,
    CardTag,
    CardUnhandledProps,
} from "./index";
import { headingSchema, HeadingSize, HeadingTag, imageSchema } from "../index";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

export default {
    name: "Card",
    component: Card,
    schema: cardSchema as any,
    documentation: <Documentation />,
    detailData: {
        children: [
            {
                id: imageSchema.id,
                props: {
                    src: "https://placehold.it/300x300/414141",
                    alt: "placeholder image",
                },
            },
        ],
    },
    data: [
        {
            tag: CardTag.section,
        },
        {
            tag: CardTag.article,
            children: [
                {
                    id: headingSchema.id,
                    props: {
                        tag: HeadingTag.h3,
                        level: HeadingSize._4,
                        children: "Example children",
                    },
                },
                {
                    id: imageSchema.id,
                    props: {
                        src: "https://placehold.it/300x300/414141",
                        alt: "placeholder image",
                    },
                },
            ],
        },
    ],
} as ComponentFactoryExample<CardProps>;
