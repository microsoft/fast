import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Hypertext, HypertextProps } from "./index";
import schema from "@microsoft/fast-components-react-base/dist/hypertext/hypertext.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Hypertext",
    component: Hypertext,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        href: "https://www.microsoft.com/en-us/",
        children: "Microsoft",
    },
    data: [
        {
            href: "https://msdn.microsoft.com",
            children: "Hypertext",
            "data-sketch-symbol": "Hypertext",
        },
        {
            children: "Hypertext",
        },
    ],
} as ComponentFactoryExample<HypertextProps>;
