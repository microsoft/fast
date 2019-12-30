import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    ContextMenu,
    contextMenuItemSchema,
    ContextMenuProps,
    contextMenuSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/context-menu/guidance";
import API from "../api";

const contextMenuConfig: ComponentViewConfig<ContextMenuProps> = {
    api: API(React.lazy(() => import("../../.tmp/context-menu/api"))),
    schema: contextMenuSchema,
    component: ContextMenu,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                children: [
                    {
                        id: contextMenuItemSchema.id,
                        props: {
                            children: "Context menu item 1",
                        },
                    },
                    {
                        id: contextMenuItemSchema.id,
                        props: {
                            children: "Context menu item 2",
                        },
                    },
                    {
                        id: contextMenuItemSchema.id,
                        props: {
                            children: "Context menu item 3",
                        },
                    },
                ],
            },
        },
    ],
};

export default contextMenuConfig;
