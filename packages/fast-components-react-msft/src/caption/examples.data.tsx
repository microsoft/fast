import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Caption } from "./index";
import {
    CaptionProps,
    CaptionSize,
    CaptionTag,
    ICaptionHandledProps
} from "./caption.props";
import schema from "./caption.schema.json";
import Documentation from "./.tmp/documentation";

const testString: string = "Caption test string default";
const testStringLevel1: string = "Caption test string size 1";
const testStringLevel2: string = "Caption test string size 2";
const testStringSpan: string = "span tag test string";
const testStringCaption: string = "caption tag test string";
const testStringFigCaption: string = "figcaption tag test string";

export default {
    name: "Caption",
    component: Caption,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Caption"
    },
    data: [
        {
            children: testString
        },
        {
            tag: CaptionTag.p,
            size: CaptionSize._1,
            children: testStringLevel1
        },
        {
            tag: CaptionTag.p,
            size: CaptionSize._2,
            children: testStringLevel2
        },
        {
            tag: CaptionTag.span,
            children: testStringSpan
        },
        {
            tag: CaptionTag.caption,
            children: testStringCaption
        },
        {
            tag: CaptionTag.figcaption,
            children: testStringFigCaption
        }
    ]
} as IComponentFactoryExample<ICaptionHandledProps>;
