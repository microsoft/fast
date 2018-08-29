import * as React from "react";
import { IComponentFactoryExample  } from "@microsoft/fast-development-site-react";
import Subheading from "./index";
import { 
    SubheadingLevel,
    SubheadingTag,
    SubheadingProps,
    ISubheadingHandledProps,
    ISubheadingUnhandledProps,,
    SubheadingTag,
    SubheadingLevel,
    SubheadingTag
    SubheadingLevel
} from "./subheading.props";

import schema from "./subheading.schema.json";

import Documentation from "./.tmp/documentation";

const testString: string = "Subheading test string";

export default {
    name: "Subheading",
    component: Subheading,
    schema: schema as any,
    documenation: <Documentation />,
    detailData: {
        children: "Subheading test"
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
            level: SubheadingLevel._1,
            children: testString,
            "data-sketch-symbol": "Subheading 1"
        },
        {
            tag: SubheadingTag.h2,
            level: SubheadingLevel._2,
            children: testString,
            "data-sketch-symbol" : "Subheading 2"
        },
        {
            tag: SubheadingTag.h3,
            level: SubheadingLevel._3,
            children: testString,
            "data-sketch-symbol": "Subheading 3"
        },
        {
            tag: SubheadingTag.h4,
            level: SubheadingLevel._4,
            children: testString,
            "data-sketch-symbol": "Subheading 4"
        },
        {
            tag: SubheadingTag.h5,
            level: SubheadingLevel._5,
            children: testString,
            "data-sketch-symbol": "Subheading 5"
        },
        {
            tag: SubheadingTag.h6,
            level: SubheadingLevel._6,
            children: testString,
            "data-sketch-symbol": "Subheading 6"
        }        
    ]
} as IComponentFactoryExample<ISubheadingHandledProps>;