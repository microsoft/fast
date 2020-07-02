import React from "react";
import { BadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { BadgeStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTBadge, {
    BadgeManagedClasses,
    BadgeSize,
    BadgeUnhandledProps,
    BadgeHandledProps as MSFTBadgeHandledProps,
    BadgeProps as MSFTBadgeProps,
} from "./badge";
import badgeSchema from "./badge.schema";
import badgeSchema2 from "./badge.schema.2";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Badge = manageJss(BadgeStyles)(MSFTBadge);
type Badge = InstanceType<typeof Badge>;

type BadgeHandledProps = Subtract<MSFTBadgeHandledProps, BadgeManagedClasses>;
type BadgeProps = ManagedJSSProps<MSFTBadgeProps, BadgeClassNameContract, DesignSystem>;

export {
    Badge,
    BadgeProps,
    BadgeClassNameContract,
    BadgeHandledProps,
    badgeSchema,
    badgeSchema2,
    BadgeSize,
    BadgeUnhandledProps,
};
