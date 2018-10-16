import { SnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import ContextMenuItem from "./index";
import { ContextMenuItemHandledProps } from "@microsoft/fast-components-react-base";

export default {
    name: "context-menu-item",
    component: ContextMenuItem,
    data: [
        {
            children: "context-menu-item"
        }
    ]
} as SnapshotTestSuite<ContextMenuItemHandledProps>;
