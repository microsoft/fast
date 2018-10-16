import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import ContextMenuItem, { ContextMenuItemHandledProps, ContextMenuItemManagedClasses } from "./context-menu-item";
import { uniqueId } from "lodash-es";

const managedClasses: ContextMenuItemManagedClasses = {
    managedClasses: {
        contextMenuItem: "context-menu-item"
    }
};

const examples: SnapshotTestSuite<ContextMenuItemHandledProps> = {
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
