import React from "react";
import Badge, { BadgeProps } from "./index";
import { badgeSchema } from "../index";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { BadgeManagedClasses } from "./badge.props";

const managedClasses: BadgeManagedClasses = {
    managedClasses: {
        badge: "badge",
    },
};

export default {
    name: "Badge",
    component: Badge,
    schema: badgeSchema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        children: "Badge",
    },
    data: [
        {
            ...managedClasses,
            children: "Badge",
        } as any,
    ],
} as ComponentFactoryExample<BadgeProps>;
