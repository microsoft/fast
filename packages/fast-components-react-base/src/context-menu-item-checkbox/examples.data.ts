import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import ContextMenuItemCheckbox, {
    ContextMenuItemCheckboxHandledProps,
    ContextMenuItemCheckboxManagedClasses,
    ContextMenuItemCheckboxProps
} from "./context-menu-item-checkbox";
import { noop, uniqueId } from "lodash-es";

const managedClasses: ContextMenuItemCheckboxManagedClasses = {
    managedClasses: {
        contextMenuItemCheckbox: "context-menu-item-checkbox"
    }
};

const examples: SnapshotTestSuite<ContextMenuItemCheckboxHandledProps & ContextMenuItemCheckboxManagedClasses> = {
    name: "context-menu-item-checkbox",
    component: ContextMenuItemCheckbox,
    data: [
        {
            ...managedClasses,
            children: "child",
            checked: true,
            id: uniqueId(),
            onChange: noop
        }
    ]
};

export default examples;
