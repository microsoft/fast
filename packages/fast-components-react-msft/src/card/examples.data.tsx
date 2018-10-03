import * as React from "react";
import { Card } from "./index";
import {
    CardHTMLTags,
    ICardHandledProps,
    ICardUnhandledProps
} from "@microsoft/fast-components-react-base";
import schema from "@microsoft/fast-components-react-base/dist/card/card.schema.json";
import ImageSchema from "@microsoft/fast-components-react-base/dist/image/image.schema.json";
import HeadingSchema from "../heading/heading.schema.json";
import { HeadingLevel, HeadingTag } from "../heading";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";

export default {
    name: "Card",
    component: Card,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: [
            {
                id: ImageSchema.id,
                props: {
                    src: "https://placehold.it/300x300/414141",
                    alt: "placeholder image"
                }
            }
        ]
    },
    data: [
        {
            tag: CardHTMLTags.section,
            children: []
        },
        {
            tag: CardHTMLTags.article,
            children: [
                {
                    id: HeadingSchema.id,
                    props: {
                        tag: HeadingTag.h3,
                        level: HeadingLevel._4,
                        children: "Example children"
                    }
                },
                {
                    id: ImageSchema.id,
                    props: {
                        src: "https://placehold.it/300x300/414141",
                        alt: "placeholder image"
                    }
                }
            ]
        }
    ]
}  as IComponentFactoryExample<ICardHandledProps>;
