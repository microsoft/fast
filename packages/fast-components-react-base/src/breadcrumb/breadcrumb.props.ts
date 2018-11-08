import * as React from "react";
import {
    BreadcrumbClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface BreadcrumbManagedClasses
    extends ManagedClasses<BreadcrumbClassNameContract> {}
export interface BreadcrumbUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface BreadcrumbHandledProps extends BreadcrumbManagedClasses {
    /**
     * The breadcrumb children
     */
    children?: React.ReactNode;

    /**
     * The breadcrumb seprator
     */
    seperator?: JSX.Element;
}

export type BreadcrumbProps = BreadcrumbHandledProps & BreadcrumbUnhandledProps;
