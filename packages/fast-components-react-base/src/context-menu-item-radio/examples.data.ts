import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts";
import ContextMenuItemRadio, { IContextMenuItemRadioHandledProps, IContextMenuItemRadioManagedClasses } from "./context-menu-item-radio";
import { uniqueId } from "lodash-es";

const managedClasses: IContextMenuItemRadioManagedClasses = {
    managedClasses: {
        contextMenuItemRadio: "context-menu-item-radio"
    }
};

const examples: ISnapshotTestSuite<IContextMenuItemRadioHandledProps & IContextMenuItemRadioManagedClasses> = {
    name: "context-menu-item-radio",
    component: ContextMenuItemRadio,
    data: [
        {
            ...managedClasses,
            children: "child",
            id: uniqueId()
        }
    ]
};

export default examples;
