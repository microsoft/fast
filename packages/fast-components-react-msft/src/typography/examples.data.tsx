import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Typography } from "./index";
import { ITypographyHandledProps, ITypographyManagedClasses, TypographySize, TypographyTag } from "@microsoft/fast-components-react-base";
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
            size: TypographySize._1,
            children: testString,
            "data-sketch-symbol": "Typographic size 1"
        },
        {
            tag: TypographyTag.h2,
            size: TypographySize._2,
            children: testString,
            "data-sketch-symbol": "Typographic size 2"
        },
        {
            tag: TypographyTag.h3,
            size: TypographySize._3,
            children: testString,
            "data-sketch-symbol": "Typographic size 3"
        },
        {
            tag: TypographyTag.h4,
            size: TypographySize._4,
            children: testString,
            "data-sketch-symbol": "Typographic size 4"
        },
        {
            tag: TypographyTag.h5,
            size: TypographySize._5,
            children: testString,
            "data-sketch-symbol": "Typographic size 5"
        },
        {
            tag: TypographyTag.h6,
            size: TypographySize._6,
            children: testString,
            "data-sketch-symbol": "Typographic size 6"
        },
        {
            tag: TypographyTag.span,
            size: TypographySize._7,
            children: testString,
            "data-sketch-symbol": "Typographic size 7"
        },
        {
            tag: TypographyTag.caption,
            size: TypographySize._8,
            children: testString,
            "data-sketch-symbol": "Typographic size 8"
        },
        {
            tag: TypographyTag.p,
            size: TypographySize._9,
            children: testString,
            "data-sketch-symbol": "Typographic size 9"
        }
    ]
} as IComponentFactoryExample<ITypographyHandledProps>;
