import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import ContextMenuItem, { IContextMenuItemHandledProps, IContextMenuItemManagedClasses } from "./context-menu-item";
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
        }
    ]
};

export default examples;
