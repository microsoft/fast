import * as React from "react";
import {
    IFoundationProps,
    ILabelClassNameContract,
    ILabelHandledProps,
    ILabelUnhandledProps,
    Label
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, LabelStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(LabelStyles)(Label);
