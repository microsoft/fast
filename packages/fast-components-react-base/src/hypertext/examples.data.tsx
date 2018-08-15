import * as React from "react";
import Hypertext, { IHypertextHandledProps, IHypertextManagedClasses, IHypertextUnhandledProps } from "./hypertext";
import schema from "./hypertext.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const examples: IComponentFactoryExample<IHypertextHandledProps & IHypertextManagedClasses> = {
    name: "Hypertext",
    component: Hypertext,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            hypertext: "hypertext"
        },
        href: "https://www.microsoft.com/en-us/",
        children: "Microsoft"
    },
    data: [
        {
            managedClasses: {
                hypertext: "hypertext"
            },
            href: "https://msdn.microsoft.com/en-us/",
            children: "MSDN"
        }
    ]
};

export default examples;
