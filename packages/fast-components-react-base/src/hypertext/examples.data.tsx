import React from "react";
import Hypertext, {
    HypertextHandledProps,
    HypertextManagedClasses,
    HypertextProps,
    HypertextUnhandledProps,
} from "./hypertext";
import { hypertextSchema } from "../index";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const examples: ComponentFactoryExample<HypertextProps> = {
    name: "Hypertext",
    component: Hypertext,
    schema: hypertextSchema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            hypertext: "hypertext",
        },
        href: "https://www.microsoft.com/en-us/",
        children: "Microsoft",
    },
    data: [
        {
            managedClasses: {
                hypertext: "hypertext",
            },
            href: "https://msdn.microsoft.com/en-us/",
            children: "MSDN",
        },
        {
            managedClasses: {
                hypertext: "hypertext",
            },
            children: "MSDN",
        },
    ],
};

export default examples;
