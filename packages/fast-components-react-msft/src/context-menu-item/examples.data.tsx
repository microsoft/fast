import * as React from "react";
import { ContextMenuItem, ContextMenuItemHandledProps } from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "@microsoft/fast-components-react-base/dist/context-menu-item/context-menu-item.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Context menu item",
    component: ContextMenuItem,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "wee",
    },
    data: [
        {
            children: "context-menu-item",
        },
    ],
} as ComponentFactoryExample<ContextMenuItemHandledProps>;
