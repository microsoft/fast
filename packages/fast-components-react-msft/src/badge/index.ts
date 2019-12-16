import React from "react";
import { BadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { BadgeStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTBadge, {
    BadgeHandledProps as MSFTBadgeHandledProps,
    BadgeProps as MSFTBadgeProps,
    BadgeSize,
    BadgeUnhandledProps,
} from "./badge";
import badgeSchema from "./badge.schema";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Badge = manageJss(BadgeStyles)(MSFTBadge);
type Badge = InstanceType<typeof Badge>;

interface BadgeHandledProps extends Omit<MSFTBadgeHandledProps, "managedClasses"> {}
type BadgeProps = ManagedJSSProps<MSFTBadgeProps, BadgeClassNameContract, DesignSystem>;

export {
    Badge,
    BadgeProps,
    BadgeClassNameContract,
    BadgeHandledProps,
    badgeSchema,
    BadgeSize,
    BadgeUnhandledProps,
};
