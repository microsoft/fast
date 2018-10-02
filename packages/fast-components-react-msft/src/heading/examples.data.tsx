import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import {
    Heading,
    HeadingProps,
    HeadingSize,
    HeadingTag
} from "./index";
import schema from "./heading.schema.json";
import Documentation from "./.tmp/documentation";

const testString: string = "Heading test string";

export default {
    name: "Heading",
    component: Heading,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Heading"
    },
    data: [
        {
            children: testString
        },
        {
            tag: HeadingTag.h1,
            size: HeadingSize._1,
            children: testString,
            "data-sketch-symbol": "Heading 1"
        },
        {
            tag: HeadingTag.h2,
            size: HeadingSize._2,
            children: testString,
            "data-sketch-symbol": "Heading 2"
        },
        {
            tag: HeadingTag.h3,
            size: HeadingSize._3,
            children: testString,
            "data-sketch-symbol": "Heading 3"
        },
        {
            tag: HeadingTag.h4,
            size: HeadingSize._4,
            children: testString,
            "data-sketch-symbol": "Heading 4"
        },
        {
            tag: HeadingTag.h5,
            size: HeadingSize._5,
            children: testString,
            "data-sketch-symbol": "Heading 5"
        },
        {
            tag: HeadingTag.h6,
            size: HeadingSize._6,
            children: testString,
            "data-sketch-symbol": "Heading 6"
        }
    ]
} as IComponentFactoryExample<HeadingProps>;
