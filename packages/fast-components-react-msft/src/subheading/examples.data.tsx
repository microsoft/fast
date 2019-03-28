import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Subheading, SubheadingProps, SubheadingSize, SubheadingTag } from "./index";
import schema from "./subheading.schema.json";
import Documentation from "./.tmp/documentation";

const testString: string = "Subheading test string";

export default {
    name: "Subheading",
    component: Subheading,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Subheading",
    },
    data: [
        {
            children: testString,
        },
        {
            tag: SubheadingTag.h1,
            children: testString,
            "data-sketch-symbol": "Subheading 1",
        },
        {
            tag: SubheadingTag.h1,
            size: SubheadingSize._1,
            children: testString,
            "data-sketch-symbol": "Subheading 1",
        },
        {
            tag: SubheadingTag.h2,
            size: SubheadingSize._2,
            children: testString,
            "data-sketch-symbol": "Subheading 2",
        },
        {
            tag: SubheadingTag.h3,
            size: SubheadingSize._3,
            children: testString,
            "data-sketch-symbol": "Subheading 3",
        },
        {
            tag: SubheadingTag.h4,
            size: SubheadingSize._4,
            children: testString,
            "data-sketch-symbol": "Subheading 4",
        },
        {
            tag: SubheadingTag.h5,
            size: SubheadingSize._5,
            children: testString,
            "data-sketch-symbol": "Subheading 5",
        },
        {
            tag: SubheadingTag.h6,
            size: SubheadingSize._6,
            children: testString,
            "data-sketch-symbol": "Subheading 6",
        },
    ],
} as ComponentFactoryExample<SubheadingProps>;
