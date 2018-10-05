import * as React from "react";
import Hypertext, { HypertextHandledProps, HypertextManagedClasses, HypertextUnhandledProps } from "./hypertext";
import schema from "./hypertext.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const examples: ComponentFactoryExample<HypertextHandledProps> = {
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
