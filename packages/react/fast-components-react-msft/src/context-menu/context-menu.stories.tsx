import { storiesOf } from "@storybook/react";
import React from "react";
import { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, designUnit } from "@microsoft/fast-components-styles-msft";
import { DividerManagedClasses } from "@microsoft/fast-components-react-base";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { Divider } from "../divider";
import { ContextMenuItem } from "../context-menu-item";
import { ContextMenu } from "./";

const styles: ComponentStyleSheet<DividerManagedClasses, DesignSystem> = {
    divider: {
        margin: format("{0} 0", toPx(designUnit)),
    },
};

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
            <Divider jssStyleSheet={styles} />
            <ContextMenuItem>Menu item 3</ContextMenuItem>
        </ContextMenu>
    ));
