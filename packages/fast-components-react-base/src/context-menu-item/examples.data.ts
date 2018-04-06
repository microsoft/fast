import {ISnapshotTestSuite} from "@microsoft/fast-jest-snapshots-react";
import {IManagedClasses} from "@microsoft/fast-components-class-name-contracts";
import ContextMenuItem, {ContextMenuItemRole, IContextMenuItemHandledProps, IContextMenuItemManagedClasses } from "./context-menu-item";

const managedClasses: IContextMenuItemManagedClasses = {
    managedClasses: {
        contextMenuItem: "context-menu-item"
    }
};

const examples: ISnapshotTestSuite<IContextMenuItemHandledProps & IContextMenuItemManagedClasses> = {
    name: "context-menu-item",
    component: ContextMenuItem,
    data: [
        {
            ...managedClasses,
            children: "child"
        },
        {
            ...managedClasses,
            children: "child",
            role: "invalid-role" as any
        },
        {
            ...managedClasses,
            children: "menuitem",
            role: ContextMenuItemRole.menuitem
        },
        {
            ...managedClasses,
            children: "menuitemradio",
            role: ContextMenuItemRole.menuitemradio
        },
        {
            ...managedClasses,
            children: "menuitemcheckbox",
            role: ContextMenuItemRole.menuitemcheckbox
        },
        {
            ...managedClasses,
            children: "menuitem checked",
            role: ContextMenuItemRole.menuitem,
            checked: true
        },
        {
            ...managedClasses,
            children: "menuitemradio checked",
            role: ContextMenuItemRole.menuitemradio,
            checked: true
        },
        {
            ...managedClasses,
            children: "menuitemcheckbox checked",
            role: ContextMenuItemRole.menuitemcheckbox,
            checked: true
        }
    ]
};

export default examples;
