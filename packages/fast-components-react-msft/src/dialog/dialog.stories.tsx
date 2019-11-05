import { storiesOf } from "@storybook/react";
import React from "react";
import { Dialog } from "./";
import { Button } from "../button";

storiesOf("Dialog", module)
    .add("Default", () => <Dialog visible={true} />)
    .add("Modal", () => (
        <div>
            <Button>Outside Button 1</Button>
            <Dialog visible={true} modal={true}>
                <Button>Button 1</Button>
                <Button>Button 2</Button>
            </Dialog>
            <Button>Outside Button 2</Button>
        </div>
    ))
    .add("Custom size", () => (
        <Dialog visible={true} contentHeight="300px" contentWidth="500px" />
    ));
