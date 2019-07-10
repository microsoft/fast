import { storiesOf } from "@storybook/react";
import React from "react";
import ContextMenuItem from "./";

storiesOf("Context menu item", module)
    .add("Default", () => <ContextMenuItem>Default menu item</ContextMenuItem>)
    .add("Disabled", () => (
        <ContextMenuItem disabled={true}>Disabled menu item</ContextMenuItem>
    ));
