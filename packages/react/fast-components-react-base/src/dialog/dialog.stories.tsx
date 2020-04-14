import { storiesOf } from "@storybook/react";
import React from "react";
import { uniqueId } from "lodash-es";
import Button from "../button";
import Select from "../select";
import ListboxItem from "../listbox-item";
import Dialog from "./";

storiesOf("Dialog", module)
    .add("Default", () => <Dialog />)
    .add("Modal", () => (
        <div>
            <Button>Outside Button 1</Button>
            <Dialog visible={true} modal={true}>
                <Button>Button 1</Button>
                <Button>Button 2</Button>
                <Button>Button 3</Button>
            </Dialog>
            <Button>Outside Button 2</Button>
        </div>
    ))
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
    ))
    .add("Modal with autofocus select", () => (
        <div>
            <Button>Outside Button 1</Button>
            <Dialog visible={true} modal={true}>
                <Button>Button 1</Button>
                <Button>Button 2</Button>
                <Button>Button 3</Button>
                <Select multiselectable={true} autoFocus={true}>
                    <ListboxItem
                        id={uniqueId()}
                        value="Select option 1"
                        children="Select option 1"
                    />
                    <ListboxItem
                        id={uniqueId()}
                        value="Select option 2"
                        children="Select option 2"
                    />
                    <ListboxItem
                        id={uniqueId()}
                        value="Select option 3"
                        children="Select option 3"
                    />
                    <ListboxItem
                        id={uniqueId()}
                        value="Select option 4"
                        children="Select option 4"
                    />
                </Select>
            </Dialog>
            <Button>Outside Button 2</Button>
        </div>
    ));
