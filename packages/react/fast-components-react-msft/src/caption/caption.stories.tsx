import { storiesOf } from "@storybook/react";
import React from "react";
import { Caption, CaptionSize, CaptionTag } from "./";

storiesOf("Caption", module)
    .add("Default", () => <Caption>Default caption</Caption>)
    .add("Size one", () => <Caption size={CaptionSize._1}>Size one caption</Caption>)
    .add("Size two", () => <Caption size={CaptionSize._2}>Size two caption</Caption>)
    .add("Paragraph element", () => (
        <Caption tag={CaptionTag.p}>Paragraph caption</Caption>
    ))
    .add("Span element", () => <Caption tag={CaptionTag.span}>Span caption</Caption>)
    .add("Figcaption element", () => (
        <Caption tag={CaptionTag.figcaption}>Figcaption caption</Caption>
    ))
    .add("Caption element", () => (
        <Caption tag={CaptionTag.caption}>Caption caption</Caption>
    ));
