import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./breadcrumb.schema.json";
import Breadcrumb, { BreadcrumbManagedClasses, BreadcrumbProps } from "./breadcrumb";
import Documentation from "./.tmp/documentation";
import reactHTMLElementSchema from "../../app/components/react-html-element.schema.json";

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

function renderSeparator(): (className?: string) => React.ReactNode {
    return (className?: string): React.ReactNode => <div className={className}>\</div>;
}

const examples: ComponentFactoryExample<BreadcrumbProps> = {
    name: "Breadcrumb",
    component: Breadcrumb,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        ...label,
        separator: renderSeparator(),
        children: [
            {
                id: "hypertext",
                props: {
                    href: "https://www.microsoft.com/en-us/",
                    children: "breadcrumb item 1",
                },
            },
            {
                id: "hypertext",
                props: {
                    href: "https://www.microsoft.com/en-us/",
                    children: "breadcrumb item 2",
                },
            },
            {
                id: "hypertext",
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
            separator: renderSeparator(),
            children: [
                {
                    id: "hypertext",
                    props: {
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 1",
                    },
                },
                {
                    id: "hypertext",
                    props: {
                        href: "https://www.microsoft.com/en-us/",
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: "hypertext",
                    props: {
                        children: "breadcrumb item 3",
                    },
                },
            ],
        },
        {
            ...managedClasses,
            ...label,
            separator: renderSeparator(),
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
