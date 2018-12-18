import React from "react";
import { ContextMenu, ContextMenuHandledProps } from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "@microsoft/fast-components-react-base/dist/context-menu/context-menu.schema.json";
import Documentation from "./.tmp/documentation";

const divider: any = {
    id: "divider",
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
                id: "context-menu-item",
                props: {
                    children: "context menu item 1",
                },
            },
            { ...divider },
            {
                id: "context-menu-item",
                props: {
                    children: "context menu item 2",
                },
            },
            {
                id: "context-menu-item",
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
                    id: "context-menu-item",
                    props: {
                        children: "context menu item 1",
                    },
                },
                { ...divider },
                {
                    id: "context-menu-item",
                    props: {
                        children: "context menu item 2",
                    },
                },
                {
                    id: "context-menu-item",
                    props: {
                        children: "context menu item 2",
                        disabled: true,
                    },
                },
                {
                    id: "context-menu-item",
                    props: {
                        children: "context menu item 3",
                    },
                },
            ],
        },
    ],
} as ComponentFactoryExample<ContextMenuHandledProps>;
