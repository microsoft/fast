import React from "react";
import { ContextMenu, ContextMenuHandledProps } from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./context-menu.schema.json";
import contextMenuItemSchema from "../context-menu-item/context-menu-item.schema.json";
import dividerSchema from "../divider/divider.schema.json";
import Documentation from "./.tmp/documentation";

const divider: any = {
    id: dividerSchema.id,
    props: {
        jssStyleSheet: {
            divider: {
                margin: "4px 0",
                opacity: ".5",
            },
        },
    },
};
export default {
    name: "Context menu",
    component: ContextMenu,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: [
            {
                id: contextMenuItemSchema.id,
                props: {
                    children: "context menu item 1",
                },
            },
            { ...divider },
            {
                id: contextMenuItemSchema.id,
                props: {
                    children: "context menu item 2",
                },
            },
            {
                id: contextMenuItemSchema.id,
                props: {
                    children: "context menu item 3",
                },
            },
        ],
    },
    data: [
        {
            children: [
                {
                    id: contextMenuItemSchema.id,
                    props: {
                        children: "context menu item 1",
                    },
                },
                { ...divider },
                {
                    id: contextMenuItemSchema.id,
                    props: {
                        children: "context menu item 2",
                    },
                },
                {
                    id: contextMenuItemSchema.id,
                    props: {
                        children: "context menu item 2",
                        disabled: true,
                    },
                },
                {
                    id: contextMenuItemSchema.id,
                    props: {
                        children: "context menu item 3",
                    },
                },
            ],
        },
    ],
} as ComponentFactoryExample<ContextMenuHandledProps>;
