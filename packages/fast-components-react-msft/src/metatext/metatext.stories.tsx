import { storiesOf } from "@storybook/react";
import React from "react";
import { Metatext, MetatextTag } from "./";
import API from "./.tmp/API.md";

storiesOf("Metatext", module)
    .addParameters({
        readme: {
            sidebar: API,
        },
    })
    .add("Default", () => <Metatext>Default metatext</Metatext>)
    .add("Paragraph element", () => (
        <Metatext tag={MetatextTag.p}>Paragraph metatext</Metatext>
    ))
    .add("Span element", () => <Metatext tag={MetatextTag.span}>Span metatext</Metatext>);
