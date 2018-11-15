import * as React from "react";
import { Breadcrumb, BreadcrumbHandledProps } from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "@microsoft/fast-components-react-base/dist/breadcrumb/breadcrumb.schema.json";
import Documentation from "./.tmp/documentation";
import ReactHTMLElementSchema from "../../app/components/react-html-element.schema.json";

export default {
    name: "Breadcrumb",
    component: Breadcrumb,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        label: "breadcrumb",
        /* tslint:disable-next-line */
        separator: (className?: string): React.ReactNode => {
            return <div className={className}>\</div>;
        },
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
            label: "breadcrumb",
            /* tslint:disable-next-line */
            separator: (className?: string): React.ReactNode => {
                return <div className={className}>\</div>;
            },
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
            label: "breadcrumb",
            /* tslint:disable-next-line */
            separator: (className?: string): React.ReactNode => {
                return <div className={className}>\</div>;
            },
            children: [
                {
                    id: ReactHTMLElementSchema.id,
                    props: {
                        tag: "a",
                        children: "breadcrumb item 1",
                    },
                },
                {
                    id: ReactHTMLElementSchema.id,
                    props: {
                        tag: "a",
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: ReactHTMLElementSchema.id,
                    props: {
                        tag: "a",
                        children: "breadcrumb item 3",
                    },
                },
            ],
        },
        {
            label: "breadcrumb",
            children: [
                {
                    id: ReactHTMLElementSchema.id,
                    props: {
                        children: "breadcrumb item 1",
                    },
                },
                {
                    id: ReactHTMLElementSchema.id,
                    props: {
                        children: "breadcrumb item 2",
                    },
                },
                {
                    id: ReactHTMLElementSchema.id,
                    props: {
                        children: "breadcrumb item 3",
                    },
                },
            ],
        },
    ],
} as ComponentFactoryExample<BreadcrumbHandledProps>;
