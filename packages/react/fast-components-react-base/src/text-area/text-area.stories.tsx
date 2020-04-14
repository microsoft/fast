import { storiesOf } from "@storybook/react";
import React from "react";
import TextArea from "./";

storiesOf("Text Area", module)
    .add("Default", () => <TextArea />)
    .add("Text Area with disabled", () => <TextArea disabled={true} />)
    .add("Text Area with required", () => <TextArea required={true} />)
    .add("Text Area with placeholder", () => <TextArea placeholder={"Placeholder"} />);
