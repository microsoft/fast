import { storiesOf } from "@storybook/react";
import React from "react";
import { action } from "@storybook/addon-actions";
import Slider from "./";

storiesOf("Slider", module).add("Default", () => (
    <Slider onValueChange={action("onValueChange")} />
));
