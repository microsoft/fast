import * as React from "react";
import {
    Button,
    IButtonClassNameContract,
    IButtonHandledProps,
    IButtonUnhandledProps,
    IFoundationProps
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { ButtonStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";

export default manageJss(ButtonStyles)(Button);
