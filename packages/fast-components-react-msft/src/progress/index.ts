import * as React from "react";
import {
    IFoundationProps,
    IProgressClassNameContract,
    IProgressHandledProps as IBaseProgressHandledProps,
    IProgressUnhandledProps,
} from "@microsoft/fast-components-react-base";
import { IMSFTProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, ProgressStyles } from "@microsoft/fast-components-styles-msft";
import Progress, { IProgressHandledProps } from "./progress";

export default manageJss(ProgressStyles)(Progress);
