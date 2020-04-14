import React from "react";
import {
    BadgeClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export type BadgeManagedClasses = ManagedClasses<BadgeClassNameContract>;
export type BadgeUnhandledProps = React.HTMLAttributes<HTMLSpanElement>;
export interface BadgeHandledProps extends BadgeManagedClasses {
    /**
     * The badge children
     */
    children?: React.ReactNode;
}

export type BadgeProps = BadgeHandledProps & BadgeUnhandledProps;
