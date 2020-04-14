import { storiesOf } from "@storybook/react";
import React from "react";
import { Paragraph, ParagraphSize } from "./";

storiesOf("Paragraph", module)
    .add("Default", () => <Paragraph>Default paragraph</Paragraph>)
    .add("Paragraph 1", () => <Paragraph size={ParagraphSize._1}>Paragraph 1</Paragraph>)
    .add("Paragraph 2", () => <Paragraph size={ParagraphSize._2}>Paragraph 2</Paragraph>)
    .add("Paragraph 3", () => <Paragraph size={ParagraphSize._3}>Paragraph 3</Paragraph>);
