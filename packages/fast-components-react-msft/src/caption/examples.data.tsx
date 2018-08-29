import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import Caption from "./index";
import {
    CaptionLevel,
    CaptionProps,
    CaptionTag,
    ICaptionHandledProps
} from "./caption.props";
import schema from "./caption.schema.json";
import Documentation from "./.tmp/documentation";

const testString: string = "Caption test string";

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
            level: CaptionLevel._1,
            children: testString
        }
    ]
} as IComponentFactoryExample<ICaptionHandledProps>;
