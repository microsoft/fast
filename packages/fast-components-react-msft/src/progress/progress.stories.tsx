import { storiesOf } from "@storybook/react";
import React from "react";
import { Progress } from "./";

storiesOf("Progress", module)
    .add("Indeterminate", () => <Progress />)
    .add("Min, max, and value", () => (
        <Progress minValue={0} maxValue={100} value={72} />
    ));
