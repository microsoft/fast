import * as React from "react";
import {
    BreadcrumbItem as BaseBreadcrumbItem,
    BreadcrumbItemClassNameContract,
    BreadcrumbItemHandledProps as BaseBreadcrumbItemHandledProps,
    BreadcrumbItemManagedClasses,
    BreadcrumbItemProps as BaseBreadcrumbItemProps,
    BreadcrumbItemUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    BreadcrumbItemStyles,
    DesignSystem,
} from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const BreadcrumbItem = manageJss(BreadcrumbItemStyles)(BaseBreadcrumbItem);
type BreadcrumbItem = InstanceType<typeof BreadcrumbItem>;

interface BreadcrumbItemHandledProps
    extends Subtract<BaseBreadcrumbItemHandledProps, BreadcrumbItemManagedClasses> {}
type BreadcrumbItemProps = ManagedJSSProps<
    BaseBreadcrumbItemProps,
    BreadcrumbItemClassNameContract,
    DesignSystem
>;

export {
    BreadcrumbItem,
    BreadcrumbItemProps,
    BreadcrumbItemClassNameContract,
    BreadcrumbItemHandledProps,
    BreadcrumbItemUnhandledProps,
};
