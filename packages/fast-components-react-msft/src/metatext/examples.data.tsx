import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Metatext, MetatextProps, metatextSchema, MetatextTag } from "./index";
import Documentation from "./.tmp/documentation";

const testString: string = "Metatext test string";

export default {
    name: "Metatext",
    component: Metatext,
    schema: metatextSchema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Metatext",
    },
    data: [
        {
            children: testString,
        },
        {
            tag: MetatextTag.p,
            children: testString,
            "data-sketch-symbol": "Metatext",
        },
        {
            tag: MetatextTag.span,
            children: testString,
        },
    ],
} as ComponentFactoryExample<MetatextProps>;
