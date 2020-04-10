import React from "react";
import {
    BadgeClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export enum BadgeSize {
    small = "small",
    large = "large",
}

export type BadgeManagedClasses = ManagedClasses<BadgeClassNameContract>;
export interface BadgeHandledProps extends BadgeManagedClasses {
    /**
     * The badge backplate appearance
     */
    filled?: boolean;

    /**
     * The badge size
     */
    size?: BadgeSize;
}

export type BadgeUnhandledProps = React.HTMLAttributes<HTMLSpanElement>;
export type BadgeProps = BadgeHandledProps & BadgeUnhandledProps;
