import { storiesOf } from "@storybook/react";
import React from "react";
import ToolbarItemGroup from "./";

storiesOf("Toolbar item group", module).add("Default", () => (
    <ToolbarItemGroup>
        <button role="button">Item 1</button>
        <button role="button">Item 2</button>
        <button role="button">Item 3</button>
    </ToolbarItemGroup>
));
