import * as React from "react";
import { IMSFTProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, ProgressStyles } from "@microsoft/fast-components-styles-msft";
import {
    IFoundationProps,
    IProgressClassNameContract
} from "@microsoft/fast-components-react-base";
import Progress, {
    IMSFTProgressHandledProps,
    IMSFTProgressManagedClasses,
    IMSFTProgressUnhandledProps,
    MSFTProgressProps
} from "./progress";

export default manageJss(ProgressStyles)(Progress);
export * from "./progress";
