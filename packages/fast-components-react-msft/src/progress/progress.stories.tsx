import { storiesOf } from "@storybook/react";
import React from "react";
import { Progress } from "./";

const progressStyle: any = {
    progress: {
        width: "400px",
    },
};

storiesOf("Progress", module)
    .add("Indeterminate", () => <Progress />)
    .add("Indeterminate narrow Width", () => <Progress jssStyleSheet={progressStyle} />)
    .add("Min, max, and value", () => <Progress minValue={0} maxValue={100} value={72} />)
    .add("Indeterminate circular", () => <Progress circular={true} />)
    .add("Min, max, and value circular", () => (
        <Progress circular={true} minValue={0} maxValue={100} value={72} />
    ));
