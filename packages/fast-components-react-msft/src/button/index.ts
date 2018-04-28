import * as React from "react";
import {
    IButtonClassNameContract,
    IButtonHandledProps as IBaseButtonHandledProps,
    IButtonUnhandledProps,
    IFoundationProps
} from "@microsoft/fast-components-react-base";
import { IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { ButtonStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import Button, { IButtonHandledProps } from "./button";

export default manageJss(ButtonStyles)(Button);
