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
