import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { Radio } from "./";
import { uniqueId } from "lodash-es";
import { Label } from "../label";
import { action } from "@storybook/addon-actions";

storiesOf("Radio", module)
    .add("Unhandled", () => <Radio inputId={uniqueId()} onChange={action("onChange")} />)
    .add("With slot label", () => {
        const id: string = uniqueId();
        return (
            <Radio inputId={id} onChange={action("onChange")}>
                <Label slot="label" htmlFor={id}>
                    Hello slot
                </Label>
            </Radio>
        );
    })
    .add("With label", () => {
        const id: string = uniqueId();
        const label: (className: string) => React.ReactNode = (
            className: string
        ): React.ReactNode => (
            <Label className={className} htmlFor={id}>
                Hello render prop
            </Label>
        );

        return <Radio inputId={id} label={label} onChange={action("onChange")} />;
    })
    .add("Disabled with slot label", () => {
        const id: string = uniqueId();
        return (
            <Radio inputId={id} onChange={action("onChange")} disabled={true}>
                <Label slot="label" htmlFor={id}>
                    Hello slot
                </Label>
            </Radio>
        );
    });
