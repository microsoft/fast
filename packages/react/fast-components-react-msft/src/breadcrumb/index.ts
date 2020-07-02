import React from "react";
import {
    Breadcrumb as BaseBreadcrumb,
    BreadcrumbHandledProps as BaseBreadcrumbHandledProps,
    BreadcrumbProps as BaseBreadcrumbProps,
    BreadcrumbClassNameContract,
    BreadcrumbManagedClasses,
    BreadcrumbUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { BreadcrumbStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import breadcrumbSchema from "./breadcrumb.schema";
import breadcrumbSchema2 from "./breadcrumb.schema.2";

const Breadcrumb = manageJss(BreadcrumbStyles)(BaseBreadcrumb);
type Breadcrumb = InstanceType<typeof Breadcrumb>;

type BreadcrumbHandledProps = Omit<
    BaseBreadcrumbHandledProps,
    keyof BreadcrumbManagedClasses
>;
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
    breadcrumbSchema,
    breadcrumbSchema2,
    BreadcrumbUnhandledProps,
};
