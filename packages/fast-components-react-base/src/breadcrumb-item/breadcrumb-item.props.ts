import * as React from "react";
import {
    BreadcrumbItemClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface BreadcrumbItemManagedClasses
    extends ManagedClasses<BreadcrumbItemClassNameContract> {}
export interface BreadcrumbItemUnhandledProps
    extends React.HTMLAttributes<HTMLLIElement> {}
export interface BreadcrumbItemHandledProps extends BreadcrumbItemManagedClasses {
    /**
     * The children of the breadcrumb-item
     */
    children?: React.ReactNode;

    /**
     * If the breadcrumb item is current
     */
    current?: boolean;

    /**
     * The destination address
     */
    href?: string;
}

export type BreadcrumbItemProps = BreadcrumbItemHandledProps &
    BreadcrumbItemUnhandledProps;
