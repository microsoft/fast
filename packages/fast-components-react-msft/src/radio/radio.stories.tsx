import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { Radio } from "./";
import { uniqueId } from "lodash-es";
import { Label } from "../label";
import { action } from "@storybook/addon-actions";

storiesOf("Radio", module)
    .add("Unhandled", () => <Radio inputId={uniqueId()} onChange={action("onChange")} />)
    .add("With label", () => {
        const id: string = uniqueId();
        return (
            <Radio inputId={id} onChange={action("onChange")}>
                <Label slot="label" htmlFor={id}>
                    Hello world
                </Label>
            </Radio>
        );
    });
