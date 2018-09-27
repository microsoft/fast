import * as React from "react";
import { IComponentFactoryExample  } from "@microsoft/fast-development-site-react";
import { Subheading } from "./index";
import {
    ISubheadingHandledProps,
    ISubheadingUnhandledProps,
    SubheadingLevel,
    SubheadingTag
} from "./subheading.props";
import Schema from "./subheading.schema.json";
import Documentation from "./.tmp/documentation";

const testString: string = "Subheading test string";

export default {
    name: "Subheading",
    component: Subheading,
    schema: Schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Subheading"
    },
    data: [
        {
            children: testString
        },
        {
            tag: SubheadingTag.h1,
            children: testString,
            "data-sketch-symbol": "Subheading 1"
        },
        {
            tag: SubheadingTag.h1,
            size: SubheadingLevel._1,
            children: testString,
            "data-sketch-symbol": "Subheading 1"
        },
        {
            tag: SubheadingTag.h2,
            size: SubheadingLevel._2,
            children: testString,
            "data-sketch-symbol" : "Subheading 2"
        },
        {
            tag: SubheadingTag.h3,
            size: SubheadingLevel._3,
            children: testString,
            "data-sketch-symbol": "Subheading 3"
        },
        {
            tag: SubheadingTag.h4,
            size: SubheadingLevel._4,
            children: testString,
            "data-sketch-symbol": "Subheading 4"
        },
        {
            tag: SubheadingTag.h5,
            size: SubheadingLevel._5,
            children: testString,
            "data-sketch-symbol": "Subheading 5"
        },
        {
            tag: SubheadingTag.h6,
            size: SubheadingLevel._6,
            children: testString,
            "data-sketch-symbol": "Subheading 6"
        }
    ]
} as IComponentFactoryExample<ISubheadingHandledProps>;
