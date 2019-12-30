import { ComponentViewConfig } from "./data.props";
import {
    ContextMenuItem,
    ContextMenuItemProps,
    contextMenuItemSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/context-menu-item/guidance";
import API from "../../.tmp/context-menu-item/api";

const contextMenuItemConfig: ComponentViewConfig<ContextMenuItemProps> = {
    api: API,
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
