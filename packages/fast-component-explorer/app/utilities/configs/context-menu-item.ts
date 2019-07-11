import { ComponentViewConfig } from "./data.props";
import {
    ContextMenuItem,
    ContextMenuItemProps,
    contextMenuItemSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/context-menu-item/guidance";

const contextMenuItemConfig: ComponentViewConfig<ContextMenuItemProps> = {
    schema: contextMenuItemSchema,
    component: ContextMenuItem,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                children: "Default menu item",
            },
        },
    ],
};

export default contextMenuItemConfig;
