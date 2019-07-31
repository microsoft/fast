import { ComponentViewConfig } from "./data.props";
import {
    Subheading,
    SubheadingProps,
    subheadingSchema,
    SubheadingSize,
    SubheadingTag,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/subheading/guidance";

const subheadingConfig: ComponentViewConfig<SubheadingProps> = {
    schema: subheadingSchema,
    component: Subheading,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Subheading 1",
            data: {
                tag: SubheadingTag.h1,
                size: SubheadingSize._1,
                children: "Subheading 1",
            },
        },
        {
            displayName: "Subheading 2",
            data: {
                tag: SubheadingTag.h2,
                size: SubheadingSize._2,
                children: "Subheading 2",
            },
        },
        {
            displayName: "Subheading 3",
            data: {
                tag: SubheadingTag.h3,
                size: SubheadingSize._3,
                children: "Subheading 3",
            },
        },
        {
            displayName: "Subheading 4",
            data: {
                tag: SubheadingTag.h4,
                size: SubheadingSize._4,
                children: "Subheading 4",
            },
        },
        {
            displayName: "Subheading 5",
            data: {
                tag: SubheadingTag.h5,
                size: SubheadingSize._5,
                children: "Subheading 5",
            },
        },
        {
            displayName: "Subheading 6",
            data: {
                tag: SubheadingTag.h6,
                size: SubheadingSize._6,
                children: "Subheading 6",
            },
        },
        {
            displayName: "Subheading p",
            data: {
                tag: SubheadingTag.p,
                children: "Subheading p",
            },
        },
    ],
};

export default subheadingConfig;
