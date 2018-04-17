import * as React from "react";
import {
    IFoundationProps,
    ILabelClassNameContract,
    ILabelHandledProps,
    ILabelUnhandledProps,
    Label
} from "@microsoft/fast-components-react-base";
import manageJss from "@microsoft/fast-jss-manager-react";
import { LabelStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(LabelStyles)(Label);
