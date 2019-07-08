import { storiesOf } from "@storybook/react";
import React from "react";
import Dialog from "./";

storiesOf("Context menu", module)
    .add("Default", () => <Dialog />)
    .add("With modal", () => <Dialog />)
    .add("With width", () => <Dialog contentWidth={"300px"} />)
    .add("With height", () => <Dialog contentHeight={"500px"} />)
    .add("With width and height", () => (
        <Dialog contentWidth={"300px"} contentHeight={"500px"} />
    ))
    .add("With label", () => <Dialog label={"Dialog"} />)
    .add("With labelledby", () => (
        <Dialog labelledBy={"dialogLabelledBy"}>
            <h2 id={"dialogLabelledBy"}>Dialog</h2>
        </Dialog>
    ))
    .add("With describedby and labelledby", () => (
        <Dialog labelledBy={"dialogLabelledBy01"} describedBy={"dialogDescribedBy"}>
            <h2 id={"dialogLabelledBy01"}>Dialog</h2>
            <p id={"dialogDescribedBy"}>Dialog description</p>
        </Dialog>
    ));
