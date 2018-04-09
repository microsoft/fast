import * as React from "react";
import {
    IFoundationProps,
    IToggleClassNameContract,
    IToggleHandledProps,
    IToggleUnhandledProps,
    Toggle
} from "@microsoft/fast-components-react-base";
import manageJss from "@microsoft/fast-jss-manager-react";
import { ToggleStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(ToggleStyles)(Toggle);
