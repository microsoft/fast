import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import ContextMenuItem from "./index";
import { IContextMenuItemHandledProps } from "@microsoft/fast-components-react-base";

export default {
    name: "context-menu-item",
    component: ContextMenuItem,
    data: [
        {
            children: "context-menu-item"
        }
    ]
} as ISnapshotTestSuite<IContextMenuItemHandledProps>;
