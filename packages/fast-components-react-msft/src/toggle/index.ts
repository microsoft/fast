import * as React from "react";
import {
    IFoundationProps,
    IToggleClassNameContract,
    IToggleHandledProps,
    IToggleUnhandledProps,
    Toggle
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, ToggleStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(ToggleStyles)(Toggle);
