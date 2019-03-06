import React from "react";
import { Badge, BadgeProps, BadgeSize } from "./index";
import schema from "./badge.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

export default {
    name: "Badge",
    component: Badge,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Badge",
        size: BadgeSize.large,
    },
    data: [
        {
            children: "Badge large",
            size: BadgeSize.large,
        },
        {
            children: "Badge small",
            size: BadgeSize.small,
        },
        {
            children: "Filled badge large",
            filled: true,
            size: BadgeSize.large,
        },
        {
            children: "Filled badge small",
            filled: true,
            size: BadgeSize.small,
        },
    ],
} as ComponentFactoryExample<BadgeProps>;
