import * as React from "react";
import { ICallToActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { CallToActionStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTCallToAction, { ICallToActionHandledProps } from "./call-to-action";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const CallToAction = manageJss(CallToActionStyles)(MSFTCallToAction);
type CallToAction = InstanceType<typeof CallToAction>;

export { CallToAction };
