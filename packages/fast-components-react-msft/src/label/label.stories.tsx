import { storiesOf } from "@storybook/react";
import React from "react";
import { Label, LabelTag } from "./";

storiesOf("Label", module)
    .add("Default", () => <Label>Default label</Label>)
    .add("Label element", () => <Label tag={LabelTag.label}>Label label</Label>)
    .add("Legend element", () => <Label tag={LabelTag.legend}>Legend label</Label>)
    .add("Hidden", () => <Label hidden={true}>Hidden label</Label>);
