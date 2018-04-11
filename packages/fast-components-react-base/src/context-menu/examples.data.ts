import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts";
import ContextMenu, { IContextMenuHandledProps, IContextMenuManagedClasses } from "./context-menu";

const managedClasses: IContextMenuManagedClasses = {
    managedClasses: {
        contextMenu: "context-menu"
    }
};

const examples: ISnapshotTestSuite<IContextMenuHandledProps & IContextMenuManagedClasses> = {
    name: "context-menu",
    component: ContextMenu,
    data: [
        {
            ...managedClasses,
            children: "child"
        }
    ]
};

export default examples;
