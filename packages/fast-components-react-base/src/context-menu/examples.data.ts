import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts";
import ContextMenu, { IContextMenuHandledProps, IContextMenuManagedClasses } from "./context-menu";
import ContextMenuItem, { ContextMenuItemProps } from "../context-menu-item";
import { uniqueId } from "lodash-es";

function contextMenuItemPropFactory(): ContextMenuItemProps {
    return {
        managedClasses: {
            contextMenuItem: "foo",
        },
        id: uniqueId()
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
                React.createElement(ContextMenuItem, contextMenuItemPropFactory(), "hello"),
                React.createElement(ContextMenuItem, contextMenuItemPropFactory(), "goodbye")
            ]
        }
    ]
};

export default examples;
