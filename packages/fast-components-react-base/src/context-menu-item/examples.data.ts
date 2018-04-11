import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts";
import ContextMenuItem, { ContextMenuItemRole, IContextMenuItemHandledProps, IContextMenuItemManagedClasses } from "./context-menu-item";
import { uniqueId } from "lodash-es";

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
            children: "child",
            id: uniqueId()
        },
        {
            ...managedClasses,
            children: "child",
            role: "invalid-role" as any,
            id: uniqueId()
        },
        {
            ...managedClasses,
            children: "menuitem",
            role: ContextMenuItemRole.menuitem,
            id: uniqueId()
        },
        {
            ...managedClasses,
            children: "menuitemradio",
            role: ContextMenuItemRole.menuitemradio,
            id: uniqueId()
        },
        {
            ...managedClasses,
            children: "menuitemcheckbox",
            role: ContextMenuItemRole.menuitemcheckbox,
            id: uniqueId()
        },
        {
            ...managedClasses,
            role: ContextMenuItemRole.separator,
            id: uniqueId()
        },
        {
            ...managedClasses,
            children: "menuitem checked",
            role: ContextMenuItemRole.menuitem,
            checked: true,
            id: uniqueId()
        },
        {
            ...managedClasses,
            children: "menuitemradio checked",
            role: ContextMenuItemRole.menuitemradio,
            checked: true,
            id: uniqueId()
        },
        {
            ...managedClasses,
            children: "menuitemcheckbox checked",
            role: ContextMenuItemRole.menuitemcheckbox,
            checked: true,
            id: uniqueId()
        },
        {
            ...managedClasses,
            children: "separator checked with children",
            role: ContextMenuItemRole.separator,
            checked: true,
            id: uniqueId()
        }
    ]
};

export default examples;
