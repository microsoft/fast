import * as React from "react";
import { BreadcrumbItem, BreadcrumbItemProps } from "./index";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "@microsoft/fast-components-react-base/dist/breadcrumb-item/breadcrumb-item.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Breadcrumb item",
    component: BreadcrumbItem,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "breadcrumb item",
    },
    data: [
        {
            href: "https://www.microsoft.com/en-us/",
            children: "child",
        },
        {
            href: "https://www.microsoft.com/en-us/",
            children: "child",
        },
        {
            href: "https://www.microsoft.com/en-us/",
            children: "child",
        },
    ],
} as ComponentFactoryExample<BreadcrumbItemProps>;
