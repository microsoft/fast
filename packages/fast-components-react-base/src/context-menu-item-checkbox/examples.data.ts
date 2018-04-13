import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts";
import ContextMenuItemCheckbox, { ContextMenuItemCheckboxProps, IContextMenuItemCheckboxHandledProps, IContextMenuItemCheckboxManagedClasses } from "./context-menu-item-checkbox";
import { uniqueId } from "lodash-es";

const managedClasses: IContextMenuItemCheckboxManagedClasses = {
    managedClasses: {
        contextMenuItemCheckbox: "context-menu-item-checkbox"
    }
};

const examples: ISnapshotTestSuite<IContextMenuItemCheckboxHandledProps & IContextMenuItemCheckboxManagedClasses> = {
    name: "context-menu-item-checkbox",
    component: ContextMenuItemCheckbox,
    data: [
        {
            ...managedClasses,
            children: "child",
            checked: true,
            id: uniqueId(),
            onChange: (item: React.ReactElement<ContextMenuItemCheckboxProps>) => { console.log(item) }
        }
    ]
};

export default examples;
