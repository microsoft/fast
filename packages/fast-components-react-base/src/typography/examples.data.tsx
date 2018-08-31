import * as React from "react";
import Typography, {
    ITypographyHandledProps,
    ITypographyManagedClasses,
    ITypographyUnhandledProps,
    TypeLevel,
    TypographyTag
} from "./typography";
import schema from "./typography.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const testString: string = "Test string";
const managedClassExamples: any = {
    typography_1: "typography-1",
    typography_2: "typography-2",
    typography_3: "typography-3",
    typography_4: "typography-4",
    typography_5: "typography-5",
    typography_6: "typography-6",
    typography_7: "typography-7",
    typography_8: "typography-8",
    typography_9: "typography-9"
};

const examples: IComponentFactoryExample<ITypographyHandledProps & ITypographyManagedClasses> = {
    name: "Typography",
    component: Typography,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: managedClassExamples,
        tag: TypographyTag.h1,
        typeLevel: TypeLevel._1,
        children: "Typography"
    },
    data: [
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h1,
            typeLevel: TypeLevel._1,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h2,
            typeLevel: TypeLevel._2,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h3,
            typeLevel: TypeLevel._3,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h4,
            typeLevel: TypeLevel._4,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h5,
            typeLevel: TypeLevel._5,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.h6,
            typeLevel: TypeLevel._6,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.span,
            typeLevel: TypeLevel._7,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.caption,
            typeLevel: TypeLevel._8,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.p,
            typeLevel: TypeLevel._9,
            children: testString
        },
        {
            managedClasses: managedClassExamples,
            tag: TypographyTag.figcaption,
            typeLevel: TypeLevel._9,
            children: testString
        }
    ]
};

export default examples;
