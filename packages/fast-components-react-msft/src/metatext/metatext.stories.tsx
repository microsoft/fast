import { storiesOf } from "@storybook/react";
import React from "react";
import { Metatext, MetatextTag } from "./";

storiesOf("Metatext", module)
    .add("Default", () => <Metatext>Default metatext</Metatext>)
    .add("Paragraph element", () => (
        <Metatext tag={MetatextTag.p}>Paragraph metatext</Metatext>
    ))
    .add("Span element", () => <Metatext tag={MetatextTag.span}>Span metatext</Metatext>);
