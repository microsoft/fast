import * as React from "react";
import {
    BadgeClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface BadgeManagedClasses extends ManagedClasses<BadgeClassNameContract> {}
export interface BadgeUnhandledProps extends React.HTMLAttributes<HTMLSpanElement> {}
export interface BadgeHandledProps extends BadgeManagedClasses {
    /**
     * The badge children
     */
    children?: React.ReactNode;
}

export type BadgeProps = BadgeHandledProps & BadgeUnhandledProps;
