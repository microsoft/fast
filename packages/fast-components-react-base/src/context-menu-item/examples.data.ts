import {ISnapshotTestSuite} from "@microsoft/fast-jest-snapshots-react";
import {IManagedClasses} from "@microsoft/fast-components-class-name-contracts";
import ContextMenuItem, {IContextMenuItemHandledProps, IContextMenuItemManagedClasses} from "./context-menu-item";

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
        }
    ]
};

export default examples;
