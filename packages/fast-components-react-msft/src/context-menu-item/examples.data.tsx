import React from "react";
import { ContextMenuItem, ContextMenuItemProps, contextMenuItemSchema } from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import Documentation from "./.tmp/documentation";

export default {
    name: "Context menu item",
    component: ContextMenuItem,
    schema: contextMenuItemSchema as any,
    documentation: <Documentation />,
    detailData: {
        children: "context menu item",
    },
    data: [
        {
            children: "context menu item",
        },
        {
            children: "context menu item",
            before: "<",
        },
        {
            children: "context menu item",
            disabled: true,
        },
    ],
} as ComponentFactoryExample<ContextMenuItemProps>;
