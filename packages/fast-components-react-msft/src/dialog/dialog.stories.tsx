import { storiesOf } from "@storybook/react";
import React from "react";
import { Dialog } from "./";

storiesOf("Dialog", module)
    .add("Default", () => <Dialog visible={true} />)
    .add("Modal", () => <Dialog visible={true} modal={true} />)
    .add("Custom size", () => (
        <Dialog visible={true} contentHeight="300px" contentWidth="500px" />
    ));
