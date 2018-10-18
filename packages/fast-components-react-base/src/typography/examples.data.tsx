import * as React from "react";
import Typography, {
    TypographyHandledProps,
    TypographyManagedClasses,
    TypographySize,
    TypographyTag,
    TypographyUnhandledProps
} from "./typography";
import schema from "./typography.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

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

const examples: ComponentFactoryExample<
    TypographyHandledProps & TypographyManagedClasses
> = {
    name: "Typography",
    component: Typography,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: managedClassExamples,
        tag: TypographyTag.h1,
        size: TypographySize._1,
        children: "Typography"
    },
    data: [
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h1,
            size: TypographySize._1,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h2,
            size: TypographySize._2,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h3,
            size: TypographySize._3,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h4,
            size: TypographySize._4,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h5,
            size: TypographySize._5,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h6,
            size: TypographySize._6,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.span,
            size: TypographySize._7,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.caption,
            size: TypographySize._8,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.p,
            size: TypographySize._9,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.figcaption,
            size: TypographySize._9,
            children: testString
        }
    ]
};

export default examples;
