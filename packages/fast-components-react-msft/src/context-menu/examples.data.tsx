import React from "react";
import { ContextMenu, ContextMenuHandledProps, contextMenuSchema } from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { contextMenuItemSchema, dividerSchema } from "../index";
import Documentation from "./.tmp/documentation";

const divider: any = {
    id: dividerSchema.id,
    props: {
        jssStyleSheet: {
            divider: {
                margin: "4px 0",
            },
        },
    },
};
export default {
    name: "Context menu",
    component: ContextMenu,
    schema: contextMenuSchema as any,
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
