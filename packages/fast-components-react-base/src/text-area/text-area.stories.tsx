import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import TextArea from "./";
import { uniqueId } from "lodash-es";

storiesOf("Text Area", module)
    .add("Default", () => <TextArea />)
    .add("Text Area with disabled", () => <TextArea disabled={true} />)
    .add("Text Area with required", () => <TextArea required={true} />)
    .add("Text Area with placeholder", () => <TextArea placeholder={"Placeholder"} />);
