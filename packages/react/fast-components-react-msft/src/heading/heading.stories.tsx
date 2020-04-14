import { storiesOf } from "@storybook/react";
import React from "react";
import { Heading, HeadingSize, HeadingTag } from "./";

storiesOf("Heading", module)
    .add("Default", () => <Heading>Default heading</Heading>)
    .add("Heading 1", () => (
        <Heading tag={HeadingTag.h1} size={HeadingSize._1}>
            Heading 1
        </Heading>
    ))
    .add("Heading 2", () => (
        <Heading tag={HeadingTag.h2} size={HeadingSize._2}>
            Heading 2
        </Heading>
    ))
    .add("Heading 3", () => (
        <Heading tag={HeadingTag.h3} size={HeadingSize._3}>
            Heading 3
        </Heading>
    ))
    .add("Heading 4", () => (
        <Heading tag={HeadingTag.h4} size={HeadingSize._4}>
            Heading 4
        </Heading>
    ))
    .add("Heading 5", () => (
        <Heading tag={HeadingTag.h5} size={HeadingSize._5}>
            Heading 5
        </Heading>
    ))
    .add("Heading 6", () => (
        <Heading tag={HeadingTag.h6} size={HeadingSize._6}>
            Heading 6
        </Heading>
    ))
    .add("Heading 7", () => (
        <Heading tag={HeadingTag.p} size={HeadingSize._7}>
            Heading 7
        </Heading>
    ));
