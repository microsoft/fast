import * as React from "react";
import Card, { ICardHandledProps, ICardManagedClasses, ICardUnhandledProps } from "./card";
import schema from "./card.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const examples: IComponentFactoryExample<ICardHandledProps & ICardManagedClasses> = {
    name: "Card",
    component: Card,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            card: "card"
        },
        children: "Card string"
    },
    data: [
        {
            managedClasses: {
                card: "card"
            },
            children: "Card string"
        }
    ]
};

export default examples;
