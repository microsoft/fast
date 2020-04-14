import { storiesOf } from "@storybook/react";
import React from "react";
import Typography, { TypographySize, TypographyTag } from "./";

storiesOf("Typography", module)
    .add("Default", () => <Typography>Default typography</Typography>)
    .add("Typography 1", () => (
        <Typography tag={TypographyTag.h1} size={TypographySize._1}>
            Typography 1
        </Typography>
    ))
    .add("Typography 2", () => (
        <Typography tag={TypographyTag.h2} size={TypographySize._2}>
            Typography 2
        </Typography>
    ))
    .add("Typography 3", () => (
        <Typography tag={TypographyTag.h3} size={TypographySize._3}>
            Typography 3
        </Typography>
    ))
    .add("Typography 4", () => (
        <Typography tag={TypographyTag.h4} size={TypographySize._4}>
            Typography 4
        </Typography>
    ))
    .add("Typography 5", () => (
        <Typography tag={TypographyTag.h5} size={TypographySize._5}>
            Typography 5
        </Typography>
    ))
    .add("Typography 6", () => (
        <Typography tag={TypographyTag.h6} size={TypographySize._6}>
            Typography 6
        </Typography>
    ))
    .add("Typography 7", () => (
        <Typography tag={TypographyTag.span} size={TypographySize._7}>
            Typography 7
        </Typography>
    ))
    .add("Typography 8", () => (
        <Typography tag={TypographyTag.caption} size={TypographySize._8}>
            Typography 8
        </Typography>
    ))
    .add("Typography 9", () => (
        <Typography tag={TypographyTag.figcaption} size={TypographySize._9}>
            Typography 9
        </Typography>
    ));
