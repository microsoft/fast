import * as React from "react";
import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Heading from "./index";
import {
    AlignHeadingBaseline,
    HeadingLevel,
    HeadingProps,
    HeadingTag,
    IHeadingHandledProps,
    IHeadingManagedClasses,
    IHeadingUnhandledProps
} from "./heading.props";
import * as schema from "./heading.schema.json";

const testString: string = "Heading test string";

export default {
    name: "heading",
    component: Heading,
    schema,
    data: [
        {
            children: testString
        },
        {
            tag: HeadingTag.h1,
            level: HeadingLevel._1,
            children: testString
        },
        {
            tag: HeadingTag.h2,
            level: HeadingLevel._2,
            children: testString
        },
        {
            tag: HeadingTag.h3,
            level: HeadingLevel._3,
            children: testString
        },
        {
            tag: HeadingTag.h4,
            level: HeadingLevel._4,
            children: testString
        },
        {
            tag: HeadingTag.h5,
            level: HeadingLevel._5,
            children: testString
        },
        {
            tag: HeadingTag.h6,
            level: HeadingLevel._6,
            children: testString
        }
    ]
} as ISnapshotTestSuite<IHeadingHandledProps>;
