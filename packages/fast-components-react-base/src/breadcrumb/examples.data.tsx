import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./breadcrumb.schema.json";
import Breadcrumb, { BreadcrumbManagedClasses, BreadcrumbProps } from "./breadcrumb";
import { BreadcrumbItemProps } from "../breadcrumb-item";
import { noop } from "lodash-es";
import Documentation from "./.tmp/documentation";

function breadcrumbItemPropFactory(): BreadcrumbItemProps {
    return {
        managedClasses: {
            breadcrumbItem: "breadcrumb-item",
            breadcrumbItem__current: "breadcrumb-item-current",
            breadcrumbItem__hypertext: "breadcrumb-item-hypertext",
        },
        onClick: noop,
    };
}

const managedClasses: BreadcrumbManagedClasses = {
    managedClasses: {
        breadcrumb: "breadcrumb",
        breadcrumb__seperator: "breadcrumb-seperator",
    },
};

const examples: ComponentFactoryExample<BreadcrumbProps> = {
    name: "Breadcrumb",
    component: Breadcrumb,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        seperator: <div>\</div>,
        children: [
            {
                id: "breadcrumb-item",
                props: {
                    ...breadcrumbItemPropFactory(),
                    href: "https://www.microsoft.com/en-us/",
                    children: "breadcrumb item 1",
                },
            },
            {
                id: "breadcrumb-item",
                props: {
                    ...breadcrumbItemPropFactory(),
                    href: "https://www.microsoft.com/en-us/",
                    children: "breadcrumb item 2",
                },
            },
            {
                id: "breadcrumb-item",
                props: {
                    ...breadcrumbItemPropFactory(),
                    href: "https://www.microsoft.com/en-us/",
                    children: "breadcrumb item 3",
                },
            },
        ],
    },
    data: [
        {
            ...managedClasses,
            seperator: <div>\</div>,
            children: [
                {
                    id: "breadcrumb-item",
                    props: {
                        ...breadcrumbItemPropFactory(),
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 1",
                    },
                },
                {
                    id: "breadcrumb-item",
                    props: {
                        ...breadcrumbItemPropFactory(),
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: "breadcrumb-item",
                    props: {
                        ...breadcrumbItemPropFactory(),
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: "breadcrumb-item",
                    props: {
                        ...breadcrumbItemPropFactory(),
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 3",
                    },
                },
            ],
        },
        {
            ...managedClasses,
            children: [
                {
                    id: "breadcrumb-item",
                    props: {
                        ...breadcrumbItemPropFactory(),
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 1",
                    },
                },
                {
                    id: "breadcrumb-item",
                    props: {
                        ...breadcrumbItemPropFactory(),
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: "breadcrumb-item",
                    props: {
                        ...breadcrumbItemPropFactory(),
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: "breadcrumb-item",
                    props: {
                        ...breadcrumbItemPropFactory(),
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 3",
                    },
                },
            ],
        },
    ],
};

export default examples;
