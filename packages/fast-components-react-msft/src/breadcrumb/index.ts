import * as React from "react";
import {
    Breadcrumb as BaseBreadcrumb,
    BreadcrumbClassNameContract,
    BreadcrumbHandledProps as BaseBreadcrumbHandledProps,
    BreadcrumbManagedClasses,
    BreadcrumbProps as BaseBreadcrumbProps,
    BreadcrumbUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { BreadcrumbStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const Breadcrumb = manageJss(BreadcrumbStyles)(BaseBreadcrumb);
type Breadcrumb = InstanceType<typeof Breadcrumb>;

interface BreadcrumbHandledProps
    extends Subtract<BaseBreadcrumbHandledProps, BreadcrumbManagedClasses> {}
type BreadcrumbProps = ManagedJSSProps<
    BaseBreadcrumbProps,
    BreadcrumbClassNameContract,
    DesignSystem
>;

export {
    Breadcrumb,
    BreadcrumbProps,
    BreadcrumbClassNameContract,
    BreadcrumbHandledProps,
    BreadcrumbUnhandledProps,
};
