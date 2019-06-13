import React from "react";
import { Badge, BadgeProps, badgeSchema, BadgeSize } from "./index";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

export default {
    name: "Badge",
    component: Badge,
    schema: badgeSchema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Badge",
        size: BadgeSize.large,
    },
    data: [
        {
            children: "Filled badge large",
            size: BadgeSize.large,
        },
        {
            children: "Filled badge small",
            size: BadgeSize.small,
        },
        {
            children: "Badge large",
            filled: false,
            size: BadgeSize.large,
        },
        {
            children: "Badge small",
            filled: false,
            size: BadgeSize.small,
        },
    ],
} as ComponentFactoryExample<BadgeProps>;
