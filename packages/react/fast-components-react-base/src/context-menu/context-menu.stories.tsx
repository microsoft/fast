import { storiesOf } from "@storybook/react";
import React from "react";
import ContextMenuItem from "../context-menu-item";
import Divider from "../divider";
import ContextMenu from "./";

storiesOf("Context menu", module)
    .add("Default", () => (
        <ContextMenu>
            <ContextMenuItem>Menu item 1</ContextMenuItem>
            <ContextMenuItem>Menu item 2</ContextMenuItem>
            <ContextMenuItem>Menu item 3</ContextMenuItem>
        </ContextMenu>
    ))
    .add("With autofocus", () => (
        <ContextMenu enableAutoFocus={true}>
            <ContextMenuItem>Menu item 1</ContextMenuItem>
            <ContextMenuItem>Menu item 2</ContextMenuItem>
            <ContextMenuItem>Menu item 3</ContextMenuItem>
        </ContextMenu>
    ))
    .add("With divider", () => (
        <ContextMenu>
            <ContextMenuItem>Menu item 1</ContextMenuItem>
            <ContextMenuItem>Menu item 2</ContextMenuItem>
            <Divider />
            <ContextMenuItem>Menu item 3</ContextMenuItem>
        </ContextMenu>
    ));
