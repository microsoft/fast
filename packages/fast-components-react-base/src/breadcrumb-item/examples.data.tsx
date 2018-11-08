import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import BreadcrumbItem, {
    BreadcrumbItemHandledProps,
    BreadcrumbItemManagedClasses,
} from "./breadcrumb-item";
import schema from "./breadcrumb-item.schema.json";
import Documentation from "./.tmp/documentation";

const managedClasses: BreadcrumbItemManagedClasses = {
    managedClasses: {
        breadcrumbItem: "breadcrumb-item",
        breadcrumbItem__current: "breadcrumb-item-current",
        breadcrumbItem__hypertext: "breadcrumb-item-hypertext",
    },
};

const examples: ComponentFactoryExample<BreadcrumbItemHandledProps> = {
    name: "Breadcrumb item",
    component: BreadcrumbItem,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        href: "https://www.microsoft.com/en-us/",
        children: "child",
    },
    data: [
        {
            ...managedClasses,
            href: "https://www.microsoft.com/en-us/",
            children: "child",
        },
        {
            ...managedClasses,
            href: "https://www.microsoft.com/en-us/",
            children: "child",
            current: true,
        },
    ],
};

export default examples;
