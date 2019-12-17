import React from "react";
import { BadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

export interface BadgeManagedClasses extends ManagedClasses<BadgeClassNameContract> {}

export enum BadgeSize {
    small = "small",
    large = "large",
}

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
/* tslint:disable-next-line:no-empty-interface */
export interface BadgeUnhandledProps extends React.HTMLAttributes<HTMLSpanElement> {}
export type BadgeProps = BadgeHandledProps & BadgeUnhandledProps;
