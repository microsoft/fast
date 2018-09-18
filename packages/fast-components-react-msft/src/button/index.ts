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
import MSFTButton, { IButtonHandledProps } from "./button";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Button = manageJss(ButtonStyles)(MSFTButton);
type Button = InstanceType<typeof Button>;

export { Button };
