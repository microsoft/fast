import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Typography from "./index";
import { ITypographyHandledProps, ITypographyManagedClasses, TypeLevel, TypographyTag } from "@microsoft/fast-components-react-base";

const testString: string = "Typography example string";

export default {
    name: "typography",
    component: Typography,
    data: [
        {
            children: testString
        },
        {
            tag: TypographyTag.h1,
            typeLevel: TypeLevel._1,
            children: testString
        },
        {
            tag: TypographyTag.h2,
            typeLevel: TypeLevel._2,
            children: testString
        },
        {
            tag: TypographyTag.h3,
            typeLevel: TypeLevel._3,
            children: testString
        },
        {
            tag: TypographyTag.h4,
            typeLevel: TypeLevel._4,
            children: testString
        },
        {
            tag: TypographyTag.h5,
            typeLevel: TypeLevel._5,
            children: testString
        },
        {
            tag: TypographyTag.h6,
            typeLevel: TypeLevel._6,
            children: testString
        },
        {
            tag: TypographyTag.span,
            typeLevel: TypeLevel._7,
            children: testString
        },
        {
            tag: TypographyTag.caption,
            typeLevel: TypeLevel._8,
            children: testString
        },
        {
            tag: TypographyTag.p,
            typeLevel: TypeLevel._9,
            children: testString
        }
    ]
} as ISnapshotTestSuite<ITypographyHandledProps>;
