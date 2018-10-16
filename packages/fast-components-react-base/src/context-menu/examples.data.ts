import * as React from "react";
import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import ContextMenu, { ContextMenuHandledProps, ContextMenuManagedClasses } from "./context-menu";
import ContextMenuItem, { ContextMenuItemProps } from "../context-menu-item";
import ContextMenuItemRadio, {
    ContextMenuItemRadioHandledProps,
    ContextMenuItemRadioManagedClasses,
    ContextMenuItemRadioProps
} from "../context-menu-item-radio";
import ContextMenuItemCheckbox, { ContextMenuItemCheckboxProps } from "../context-menu-item-checkbox";
import { noop, uniqueId } from "lodash-es";

function contextMenuItemPropFactory(): ContextMenuItemProps {
    return {
        managedClasses: {
            contextMenuItem: "context-menu-item",
        },
        id: uniqueId(),
        onClick: noop
    };
}

function contextMenuItemRadioPropFactory(checked: boolean = false): ContextMenuItemRadioProps {
    return {
        managedClasses: {
            contextMenuItemRadio: "context-menu-item-radio",
        },
        checked,
        id: uniqueId(),
        onChange: noop
    };
}

function contextMenuItemCheckboxPropFactory(checked: boolean = false): ContextMenuItemCheckboxProps {
    return {
        managedClasses: {
            contextMenuItemCheckbox: "context-menu-item-checkbox",
        },
        checked,
        id: uniqueId(),
        onChange: noop
    };
}

const managedClasses: ContextMenuManagedClasses = {
    managedClasses: {
        contextMenu: "context-menu",
        contextMenu_open: "open"
    }
};

const examples: SnapshotTestSuite<ContextMenuHandledProps> = {
    name: "context-menu",
    component: ContextMenu,
    data: [
        {
            ...managedClasses,
            open: true,
            children: [
                React.createElement(ContextMenuItem, contextMenuItemPropFactory(), "context menu item 1"),
                React.createElement(ContextMenuItem, contextMenuItemPropFactory(), "context menu item 2"),
                React.createElement(ContextMenuItem, contextMenuItemPropFactory(), "context menu item 3")
            ]
        },
        {
            ...managedClasses,
            open: true,
            children: [
                React.createElement(ContextMenuItemRadio, contextMenuItemRadioPropFactory(), "context menu item radio 1"),
                React.createElement(ContextMenuItemRadio, contextMenuItemRadioPropFactory(), "context menu item radio 2"),
                React.createElement(ContextMenuItemRadio, contextMenuItemRadioPropFactory(), "context menu item radio 3")
            ]
        }
    ]
};

export default examples;
