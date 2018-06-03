import * as React from "react";
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
import Documentation from "./.tmp/documentation";

const testString: string = "Heading test string";

export default {
    name: "heading",
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
            level: HeadingLevel._1,
            children: testString,
            "data-sketch-symbol": "Heading 1"
        },
        {
            tag: HeadingTag.h2,
            level: HeadingLevel._2,
            children: testString,
            "data-sketch-symbol": "Heading 2"
        },
        {
            tag: HeadingTag.h3,
            level: HeadingLevel._3,
            children: testString,
            "data-sketch-symbol": "Heading 3"
        },
        {
            tag: HeadingTag.h4,
            level: HeadingLevel._4,
            children: testString,
            "data-sketch-symbol": "Heading 4"
        },
        {
            tag: HeadingTag.h5,
            level: HeadingLevel._5,
            children: testString,
            "data-sketch-symbol": "Heading 5"
        },
        {
            tag: HeadingTag.h6,
            level: HeadingLevel._6,
            children: testString,
            "data-sketch-symbol": "Heading 6"
        }
    ]
} as ISnapshotTestSuite<IHeadingHandledProps>;
