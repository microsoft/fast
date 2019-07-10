import { storiesOf } from "@storybook/react";
import React from "react";
import Progress, { ProgressType } from "./";

storiesOf("Progress", module)
    .add("Indeterminate", () => (
        <Progress>
            <div slot={ProgressType.determinate}>determinate indicator</div>
            <div slot={ProgressType.indeterminate}>indeterminate indicator</div>
        </Progress>
    ))
    .add("Determinate", () => (
        <Progress value={72}>
            <div slot={ProgressType.determinate}>determinate indicator</div>
            <div slot={ProgressType.indeterminate}>indeterminate indicator</div>
        </Progress>
    ));
