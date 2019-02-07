import * as React from "react";
import { Badge, BadgeAppearance, BadgeProps, BadgeSize } from "./index";
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
        appearance: BadgeAppearance.lowlight,
        size: BadgeSize.large,
    },
    data: [
        {
            children: "Badge lowlight large",
            appearance: BadgeAppearance.lowlight,
            size: BadgeSize.large,
        },
        {
            children: "Badge highlight large",
            appearance: BadgeAppearance.highlight,
            size: BadgeSize.large,
        },
        {
            children: "Badge accent large",
            appearance: BadgeAppearance.accent,
            size: BadgeSize.large,
        },
        {
            children: "Badge lowlight small",
            appearance: BadgeAppearance.lowlight,
            size: BadgeSize.small,
        },
        {
            children: "Badge highlight small",
            appearance: BadgeAppearance.highlight,
            size: BadgeSize.small,
        },
        {
            children: "Badge accent small",
            appearance: BadgeAppearance.accent,
            size: BadgeSize.small,
        },
        {
            children: "Badge default small",
            size: BadgeSize.small,
        },
        {
            children: "Badge default large",
            size: BadgeSize.large,
        } as any,
    ],
} as ComponentFactoryExample<BadgeProps>;
