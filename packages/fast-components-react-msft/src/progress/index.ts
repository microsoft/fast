import * as React from "react";
import { IMSFTProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, ProgressStyles } from "@microsoft/fast-components-styles-msft";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import { IProgressClassNameContract } from "@microsoft/fast-components-react-base";
import MSFTProgress, {
    IMSFTProgressHandledProps,
    IMSFTProgressManagedClasses,
    IMSFTProgressUnhandledProps,
    MSFTProgressProps
} from "./progress";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Progress = manageJss(ProgressStyles)(MSFTProgress);
type Progress = InstanceType<typeof Progress>;

export { Progress };
export * from "./progress";
