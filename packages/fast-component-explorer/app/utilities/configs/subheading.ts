import { ComponentViewConfig } from "./data.props";
import {
    Subheading,
    SubheadingProps,
    subheadingSchema,
    SubheadingSize,
    SubheadingTag,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/subheading/guidance";
import API from "../../.tmp/subheading/api";

const subheadingConfig: ComponentViewConfig<SubheadingProps> = {
    api: API,
    schema: subheadingSchema,
    component: Subheading,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Subheading 1",
            data: {
                tag: SubheadingTag.h1,
                size: SubheadingSize._1,
                children: "Subheading",
            },
        },
        {
            displayName: "Subheading 2",
            data: {
                tag: SubheadingTag.h2,
                size: SubheadingSize._2,
                children: "Subheading",
            },
        },
        {
            displayName: "Subheading 3",
            data: {
                tag: SubheadingTag.h3,
                size: SubheadingSize._3,
                children: "Subheading",
            },
        },
        {
            displayName: "Subheading 4",
            data: {
                tag: SubheadingTag.h4,
                size: SubheadingSize._4,
                children: "Subheading",
            },
        },
        {
            displayName: "Subheading 5",
            data: {
                tag: SubheadingTag.h5,
                size: SubheadingSize._5,
                children: "Subheading",
            },
        },
        {
            displayName: "Subheading 6",
            data: {
                tag: SubheadingTag.h6,
                size: SubheadingSize._6,
                children: "Subheading",
            },
        },
        {
            displayName: "Subheading p",
            data: {
                tag: SubheadingTag.p,
                children: "Subheading",
            },
        },
    ],
};

export default subheadingConfig;
