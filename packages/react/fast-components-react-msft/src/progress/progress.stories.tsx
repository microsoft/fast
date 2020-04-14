import { storiesOf } from "@storybook/react";
import React from "react";
import { ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { ProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { Progress } from "./";

const progressStyle: ComponentStyleSheet<
    Partial<ProgressClassNameContract>,
    DesignSystem
> = {
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
