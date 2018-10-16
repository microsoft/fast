import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import ContextMenuItemRadio, {
    ContextMenuItemRadioHandledProps,
    ContextMenuItemRadioManagedClasses,
    ContextMenuItemRadioProps
} from "./context-menu-item-radio";
import { noop, uniqueId } from "lodash-es";

const managedClasses: ContextMenuItemRadioManagedClasses = {
    managedClasses: {
        contextMenuItemRadio: "context-menu-item-radio"
    }
};

const examples: SnapshotTestSuite<ContextMenuItemRadioHandledProps & ContextMenuItemRadioManagedClasses> = {
    name: "context-menu-item-radio",
    component: ContextMenuItemRadio,
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
