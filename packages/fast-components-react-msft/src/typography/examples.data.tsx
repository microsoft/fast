import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Typography } from "./index";
import { ITypographyHandledProps, ITypographyManagedClasses, TypeLevel, TypographyTag } from "@microsoft/fast-components-react-base";
import schema from "@microsoft/fast-components-react-base/dist/typography/typography.schema.json";
import Documentation from "./.tmp/documentation";

const testString: string = "Typography example string";

export default {
    name: "Typography",
    component: Typography,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Typography"
    },
    data: [
        {
            children: testString
        },
        {
            tag: TypographyTag.h1,
            typeLevel: TypeLevel._1,
            children: testString,
            "data-sketch-symbol": "Typographic level 1"
        },
        {
            tag: TypographyTag.h2,
            typeLevel: TypeLevel._2,
            children: testString,
            "data-sketch-symbol": "Typographic level 2"
        },
        {
            tag: TypographyTag.h3,
            typeLevel: TypeLevel._3,
            children: testString,
            "data-sketch-symbol": "Typographic level 3"
        },
        {
            tag: TypographyTag.h4,
            typeLevel: TypeLevel._4,
            children: testString,
            "data-sketch-symbol": "Typographic level 4"
        },
        {
            tag: TypographyTag.h5,
            typeLevel: TypeLevel._5,
            children: testString,
            "data-sketch-symbol": "Typographic level 5"
        },
        {
            tag: TypographyTag.h6,
            typeLevel: TypeLevel._6,
            children: testString,
            "data-sketch-symbol": "Typographic level 6"
        },
        {
            tag: TypographyTag.span,
            typeLevel: TypeLevel._7,
            children: testString,
            "data-sketch-symbol": "Typographic level 7"
        },
        {
            tag: TypographyTag.caption,
            typeLevel: TypeLevel._8,
            children: testString,
            "data-sketch-symbol": "Typographic level 8"
        },
        {
            tag: TypographyTag.p,
            typeLevel: TypeLevel._9,
            children: testString,
            "data-sketch-symbol": "Typographic level 9"
        }
    ]
} as IComponentFactoryExample<ITypographyHandledProps>;
