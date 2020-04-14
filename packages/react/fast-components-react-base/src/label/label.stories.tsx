import { storiesOf } from "@storybook/react";
import React from "react";
import Label, { LabelTag } from "./";

storiesOf("Label", module)
    .add("Label", () => <Label>Label</Label>)
    .add("Label with label tag", () => <Label tag={LabelTag.label}>Label</Label>)
    .add("Label with legend tag", () => <Label tag={LabelTag.legend}>Legend</Label>)
    .add("Hidden label", () => (
        <Label tag={LabelTag.legend} hidden={true}>
            Hidden label
        </Label>
    ))
    .add("Label with htmlFor attribute", () => (
        <React.Fragment>
            <Label tag={LabelTag.legend} htmlFor={"id01"}>
                Label with htmlFor
            </Label>
            <input id={"id01"} type={"text"} />
        </React.Fragment>
    ));
