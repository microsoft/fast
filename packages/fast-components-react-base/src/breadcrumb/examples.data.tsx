import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { breadcrumbSchema, hypertextSchema } from "../index";
import Breadcrumb, { BreadcrumbManagedClasses, BreadcrumbProps } from "./breadcrumb";
import Documentation from "./.tmp/documentation";
import reactHTMLElementSchema from "../../app/components/react-html-element.schema";

const managedClasses: BreadcrumbManagedClasses = {
    managedClasses: {
        breadcrumb: "breadcrumb",
        breadcrumb_item: "breadcrumb-item",
        breadcrumb_item__current: "breadcrumb-item-current",
        breadcrumb_itemsContainer: "breadcrumb-items-container-class",
        breadcrumb_separator: "breadcrumb-separator",
    },
};

const label: any = {
    label: "breadcrumb",
};

function separator(): any {
    return {
        id: reactHTMLElementSchema.id,
        props: {
            children: "\\",
        },
    };
}

const examples: ComponentFactoryExample<BreadcrumbProps> = {
    name: "Breadcrumb",
    component: Breadcrumb,
    schema: breadcrumbSchema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        ...label,
        separator: separator(),
        children: [
            {
                id: hypertextSchema.id,
                props: {
                    href: "https://www.microsoft.com/en-us/",
                    children: "breadcrumb item 1",
                },
            },
            {
                id: hypertextSchema.id,
                props: {
                    href: "https://www.microsoft.com/en-us/",
                    children: "breadcrumb item 2",
                },
            },
            {
                id: hypertextSchema.id,
                props: {
                    children: "breadcrumb item 3",
                },
            },
        ],
    },
    data: [
        {
            ...managedClasses,
            ...label,
            separator: separator(),
            children: [
                {
                    id: hypertextSchema.id,
                    props: {
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 1",
                    },
                },
                {
                    id: hypertextSchema.id,
                    props: {
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: hypertextSchema.id,
                    props: {
                        children: "breadcrumb item 3",
                    },
                },
            ],
        },
        {
            ...managedClasses,
            ...label,
            separator: separator(),
            children: [
                {
                    id: reactHTMLElementSchema.id,
                    props: {
                        tag: "a",
                        children: "breadcrumb item 1",
                    },
                },
                {
                    id: reactHTMLElementSchema.id,
                    props: {
                        tag: "a",
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: reactHTMLElementSchema.id,
                    props: {
                        tag: "a",
                        children: "breadcrumb item 3",
                    },
                },
            ],
        },
        {
            ...managedClasses,
            ...label,
            children: [
                {
                    id: reactHTMLElementSchema.id,
                    props: {
                        children: "breadcrumb item 1",
                    },
                },
                {
                    id: reactHTMLElementSchema.id,
                    props: {
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: reactHTMLElementSchema.id,
                    props: {
                        children: "breadcrumb item 3",
                    },
                },
            ],
        },
    ],
};

export default examples;
