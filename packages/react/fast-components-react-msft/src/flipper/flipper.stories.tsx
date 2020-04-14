import { storiesOf } from "@storybook/react";
import React from "react";
import { action } from "@storybook/addon-actions";
import { Flipper, FlipperDirection } from "./";

storiesOf("Flipper", module)
    .add("Default", () => <Flipper onClick={action("onClick")} />)
    .add("Previous", () => (
        <Flipper direction={FlipperDirection.previous} onClick={action("onClick")} />
    ))
    .add("Next", () => (
        <Flipper direction={FlipperDirection.next} onClick={action("onClick")} />
    ))
    .add("With label", () => <Flipper label="Next item" onClick={action("onClick")} />);
