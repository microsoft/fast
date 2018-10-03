import * as React from "react";
import { ICallToActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { IJSSManagerProps, JSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { CallToActionStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTCallToAction, {
    CallToActionAppearance,
    CallToActionProps as MSFTCallToActionProps,
    ICallToActionHandledProps as IMSFTCallToActionHandledProps,
    ICallToActionManagedClasses,
    ICallToActionUnhandledProps
} from "./call-to-action";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const CallToAction = manageJss(CallToActionStyles)(MSFTCallToAction);
type CallToAction = InstanceType<typeof CallToAction>;

interface ICallToActionHandledProps extends Subtract<IMSFTCallToActionHandledProps, ICallToActionManagedClasses> {}
type CallToActionProps = JSSManagerProps<MSFTCallToActionProps, ICallToActionClassNameContract, IDesignSystem>;

export {
    CallToAction,
    CallToActionAppearance,
    CallToActionProps,
    ICallToActionClassNameContract,
    ICallToActionHandledProps,
    ICallToActionUnhandledProps
};
