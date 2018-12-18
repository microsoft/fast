import React from "react";
import { ContextMenuItem, ContextMenuItemProps } from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "@microsoft/fast-components-react-base/dist/context-menu-item/context-menu-item.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Context menu item",
    component: ContextMenuItem,
    schema: schema as any,
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
