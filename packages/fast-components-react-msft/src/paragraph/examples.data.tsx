import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Paragraph, ParagraphProps, ParagraphSize } from "./index";
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
            size: ParagraphSize._1,
            children: testString,
            "data-sketch-symbol": "Paragraph 1"
        },
        {
            size: ParagraphSize._2,
            children: testString,
            "data-sketch-symbol": "Paragraph 2"
        },
        {
            size: ParagraphSize._3,
            children: testString,
            "data-sketch-symbol": "Paragraph 3"
        }
    ]
} as ComponentFactoryExample<ParagraphProps>;
