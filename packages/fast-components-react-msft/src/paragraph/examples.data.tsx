import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Paragraph } from "./index";
import {
    IParagraphHandledProps,
    IParagraphManagedClasses,
    IParagraphUnhandledProps,
    ParagraphLevel,
    ParagraphProps
} from "./paragraph.props";
import schema from "./paragraph.schema.json";
import Documentation from "./.tmp/documentation";

const testString: string = "Paragraph test string";

export default {
    name: "Paragraph",
    component: Paragraph,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Paragraph"
    },
    data: [
        {
            children: testString
        },
        {
            size: ParagraphLevel._1,
            children: testString,
            "data-sketch-symbol": "Paragraph 1"
        },
        {
            size: ParagraphLevel._2,
            children: testString,
            "data-sketch-symbol": "Paragraph 2"
        },
        {
            size: ParagraphLevel._3,
            children: testString,
            "data-sketch-symbol": "Paragraph 3"
        }
    ]
} as IComponentFactoryExample<IParagraphHandledProps>;
