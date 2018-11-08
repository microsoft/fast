import * as React from "react";
import { Breadcrumb, BreadcrumbHandledProps } from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "@microsoft/fast-components-react-base/dist/breadcrumb/breadcrumb.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Breadcrumb",
    component: Breadcrumb,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        seperator: <div>\</div>,
        children: [
            {
                id: "breadcrumb-item",
                props: {
                    href: "https://www.microsoft.com/en-us/",
                    children: "breadcrumb item 1",
                },
            },
            {
                id: "breadcrumb-item",
                props: {
                    href: "https://www.microsoft.com/en-us/",
                    children: "breadcrumb item 2",
                },
            },
            {
                id: "breadcrumb-item",
                props: {
                    href: "https://www.microsoft.com/en-us/",
                    children: "breadcrumb item 3",
                },
            },
        ],
    },
    data: [
        {
            seperator: <div>\</div>,
            children: [
                {
                    id: "breadcrumb-item",
                    props: {
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 1",
                    },
                },
                {
                    id: "breadcrumb-item",
                    props: {
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: "breadcrumb-item",
                    props: {
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: "breadcrumb-item",
                    props: {
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 3",
                    },
                },
            ],
        },
        {
            children: [
                {
                    id: "breadcrumb-item",
                    props: {
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 1",
                    },
                },
                {
                    id: "breadcrumb-item",
                    props: {
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: "breadcrumb-item",
                    props: {
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: "breadcrumb-item",
                    props: {
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 3",
                    },
                },
            ],
        },
    ],
} as ComponentFactoryExample<BreadcrumbHandledProps>;
