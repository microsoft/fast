import {ISnapshotTestSuite} from "@microsoft/fast-jest-snapshots-react";
import {IManagedClasses} from "@microsoft/fast-components-class-name-contracts";
import ContextMenuItem, {IContextMenuItemHandledProps, IContextMenuItemManagedClasses} from "./context-menu-item";

const examples: ISnapshotTestSuite<IContextMenuItemHandledProps & IContextMenuItemManagedClasses> = {
    name: "context-menu-item",
    component: ContextMenuItem,
    data: [
        {
            managedClasses: {
                contextMenuItem: "context-menu-item"
            },
            children: "child"
        },
        {
            managedClasses: {
                contextMenuItem: "context-menu-item"
            },
            children: "child",
            role: "invalid-role" as any
        }
    ]
};

export default examples;
