import { storiesOf } from "@storybook/react";
import React from "react";
import Slider, { SliderClassNameContract } from "./";
import { action } from "@storybook/addon-actions";

storiesOf("Slider", module).add("Default", () => (
    <Slider onValueChange={action("onValueChange")} />
));
