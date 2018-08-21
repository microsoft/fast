import * as React from "react";
import Card from "./index";
import { ICardHandledProps, ICardManagedClasses, ICardUnhandledProps } from "@microsoft/fast-components-react-base";
import schema from "@microsoft/fast-components-react-base/dist/card/card.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

export default {
    name: "Card",
    component: Card,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Card string"
    },
    data: [
        {
            children: "Card string"
        }
    ]
}  as IComponentFactoryExample<ICardHandledProps>;
