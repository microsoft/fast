import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import ContextMenuItem, {
    ContextMenuItemHandledProps,
    ContextMenuItemManagedClasses,
} from "./context-menu-item";
import { contextMenuItemSchema } from "../index";
import Documentation from "./.tmp/documentation";

const managedClasses: ContextMenuItemManagedClasses = {
    managedClasses: {
        contextMenuItem: "context-menu-item",
    },
};

const examples: ComponentFactoryExample<ContextMenuItemHandledProps> = {
    name: "Context menu item",
    component: ContextMenuItem,
    schema: contextMenuItemSchema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        children: "child",
    },
    data: [
        {
            ...managedClasses,
            children: "child",
        },
    ],
};

export default examples;
