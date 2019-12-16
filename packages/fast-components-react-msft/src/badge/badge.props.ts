import React from "react";
import { BadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

interface ManagedClasses<T> {
    managedClasses: T;
}

export enum BadgeSize {
    small = "small",
    large = "large",
}

export interface BadgeHandledProps extends ManagedClasses<BadgeClassNameContract> {
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
