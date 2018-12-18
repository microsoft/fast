import React from "react";
import { ProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, ProgressStyles } from "@microsoft/fast-components-styles-msft";
import MSFTProgress, {
    ProgressHandledProps as MSFTProgressHandledProps,
    ProgressManagedClasses,
    ProgressProps as MSFTProgressProps,
    ProgressUnhandledProps,
} from "./progress";
import { Subtract } from "utility-types";
/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Progress = manageJss(ProgressStyles)(MSFTProgress);
type Progress = InstanceType<typeof Progress>;

interface ProgressHandledProps
    extends Subtract<MSFTProgressHandledProps, ProgressManagedClasses> {}
type ProgressProps = ManagedJSSProps<
    MSFTProgressProps,
    ProgressClassNameContract,
    DesignSystem
>;

export {
    Progress,
    ProgressProps,
    ProgressUnhandledProps,
    ProgressHandledProps,
    ProgressClassNameContract,
};
