import {
    ContextMenuItem,
    ContextMenuItemProps,
    contextMenuItemSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/context-menu-item/guidance";
import { ComponentViewConfig } from "./data.props";

const contextMenuItemConfig: ComponentViewConfig<ContextMenuItemProps> = {
    schema: contextMenuItemSchema,
    component: ContextMenuItem,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                children: "Context menu item",
            },
        },
    ],
};

export default contextMenuItemConfig;
