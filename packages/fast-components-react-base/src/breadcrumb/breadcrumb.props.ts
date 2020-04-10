import React from "react";
import {
    BreadcrumbClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export type BreadcrumbManagedClasses = ManagedClasses<BreadcrumbClassNameContract>;
export type BreadcrumbUnhandledProps = React.HTMLAttributes<HTMLElement>;
export interface BreadcrumbHandledProps extends BreadcrumbManagedClasses {
    /**
     * The breadcrumb children
     */
    children?: React.ReactNode;

    /**
     * The aria-label to provide an accessible name for the breadcrumb
     */
    label?: string;

    /**
     * The breadcrumb seprator
     */
    separator?: (className: string) => React.ReactNode;
}

export type BreadcrumbProps = BreadcrumbHandledProps & BreadcrumbUnhandledProps;
