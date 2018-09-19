import * as React from "react";
import Typography, {
    ITypographyHandledProps,
    ITypographyManagedClasses,
    ITypographyUnhandledProps,
    Size,
    TypographyTag
} from "./typography";
import schema from "./typography.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const testString: string = "Test string";
const managedClassExamples: any = {
    typography: "typography",
    typography__1: "typography-1",
    typography__2: "typography-2",
    typography__3: "typography-3",
    typography__4: "typography-4",
    typography__5: "typography-5",
    typography__6: "typography-6",
    typography__7: "typography-7",
    typography__8: "typography-8",
    typography__9: "typography-9"
};

const examples: IComponentFactoryExample<ITypographyHandledProps & ITypographyManagedClasses> = {
    name: "Typography",
    component: Typography,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: managedClassExamples,
        tag: TypographyTag.h1,
        size: Size._1,
        children: "Typography"
    },
    data: [
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h1,
            size: Size._1,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h2,
            size: Size._2,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h3,
            size: Size._3,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h4,
            size: Size._4,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h5,
            size: Size._5,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h6,
            size: Size._6,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.span,
            size: Size._7,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.caption,
            size: Size._8,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.p,
            size: Size._9,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.figcaption,
            size: Size._9,
            children: testString
        }
    ]
};

export default examples;
