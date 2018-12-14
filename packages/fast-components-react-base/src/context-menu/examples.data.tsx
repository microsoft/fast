import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./context-menu.schema.json";
import ContextMenu, { ContextMenuManagedClasses, ContextMenuProps } from "./context-menu";
import { ContextMenuItemProps } from "../context-menu-item";
import { noop } from "lodash-es";
import Documentation from "./.tmp/documentation";

function contextMenuItemPropFactory(): ContextMenuItemProps {
    return {
        managedClasses: {
            contextMenuItem: "context-menu-item",
        },
        onClick: noop,
    };
}

const managedClasses: ContextMenuManagedClasses = {
    managedClasses: {
        contextMenu: "context-menu",
    },
};

const examples: ComponentFactoryExample<ContextMenuProps> = {
    name: "Context menu",
    component: ContextMenu,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        children: [
            {
                id: "context-menu-item",
                props: {
                    ...contextMenuItemPropFactory(),
                    children: "context menu item 1",
                },
            },
            {
                id: "context-menu-item",
                props: {
                    ...contextMenuItemPropFactory(),
                    children: "context menu item 2",
                },
            },
            {
                id: "context-menu-item",
                props: {
                    ...contextMenuItemPropFactory(),
                    children: "context menu item 3",
                },
            },
        ],
    },
    data: [
        {
            ...managedClasses,
            children: [
                {
                    id: "context-menu-item",
                    props: {
                        ...contextMenuItemPropFactory(),
                        children: "context menu item 1",
                    },
                },
                {
                    id: "divider",
                },
                {
                    id: "context-menu-item",
                    props: {
                        ...contextMenuItemPropFactory(),
                        children: "context menu item 2",
                    },
                },
                {
                    id: "context-menu-item",
                    props: {
                        ...contextMenuItemPropFactory(),
                        children: "context menu item 2",
                        disabled: true,
                    },
                },
                {
                    id: "context-menu-item",
                    props: {
                        ...contextMenuItemPropFactory(),
                        children: "context menu item 3",
                    },
                },
            ],
        },
    ],
};

export default examples;
