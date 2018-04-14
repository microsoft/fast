import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts";
import ContextMenu, { IContextMenuHandledProps, IContextMenuManagedClasses } from "./context-menu";
import ContextMenuItem, { ContextMenuItemProps } from "../context-menu-item";
import ContextMenuItemRadio, {
    ContextMenuItemRadioProps,
    IContextMenuItemRadioHandledProps,
    IContextMenuItemRadioManagedClasses 
} from "../context-menu-item-radio";
import ContextMenuItemCheckbox, { ContextMenuItemCheckboxProps } from "../context-menu-item-checkbox";
import { uniqueId } from "lodash-es";

function contextMenuItemPropFactory(): ContextMenuItemProps {
    return {
        managedClasses: {
            contextMenuItem: "context-menu-item",
        },
        id: uniqueId(),
        onClick: (e: any) => {
            console.log(e);
        }
    }
}

function contextMenuItemRadioPropFactory(checked: boolean = false): ContextMenuItemRadioProps {
    return {
        managedClasses: {
            contextMenuItemRadio: "context-menu-item-radio",
        },
        checked,
        id: uniqueId(),
        onChange: (e: any): void => {}
    }
}

function contextMenuItemCheckboxPropFactory(checked: boolean = false): ContextMenuItemCheckboxProps {
    return {
        managedClasses: {
            contextMenuItemCheckbox: "context-menu-item-checkbox",
        },
        checked,
        id: uniqueId(),
        onChange: (e: any) => {
            console.log(e);
        }
    }
}

const managedClasses: IContextMenuManagedClasses = {
    managedClasses: {
        contextMenu: "context-menu",
        contextMenu_open: "open"
    }
};

const examples: ISnapshotTestSuite<IContextMenuHandledProps & IContextMenuManagedClasses> = {
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
};

export default examples;
