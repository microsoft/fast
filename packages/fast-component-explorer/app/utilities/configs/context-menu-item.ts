import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    ContextMenuItem,
    ContextMenuItemProps,
    contextMenuItemSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/context-menu-item/guidance";
import API from "../api";

const contextMenuItemConfig: ComponentViewConfig<ContextMenuItemProps> = {
    api: API(React.lazy(() => import("../../.tmp/context-menu-item/api"))),
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
