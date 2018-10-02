import * as React from "react";
import { IProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { IJSSManagerProps, JSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, ProgressStyles } from "@microsoft/fast-components-styles-msft";
import MSFTProgress, {
    IProgressHandledProps as IMSFTProgressHandledProps,
    IProgressManagedClasses,
    IProgressUnhandledProps,
    ProgressProps as MSFTProgressProps
} from "./progress";
import { Subtract } from "utility-types";
/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Progress = manageJss(ProgressStyles)(MSFTProgress);
type Progress = InstanceType<typeof Progress>;

interface IProgressHandledProps extends Subtract<IMSFTProgressHandledProps, IProgressManagedClasses> {}
type ProgressProps = JSSManagerProps<MSFTProgressProps, IProgressClassNameContract, IDesignSystem>;

export {
    Progress,
    ProgressProps,
    IProgressUnhandledProps,
    IProgressHandledProps,
    IProgressClassNameContract
};
