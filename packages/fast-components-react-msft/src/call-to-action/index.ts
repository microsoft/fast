import React from "react";
import { CallToActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { CallToActionStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTCallToAction, {
    CallToActionAppearance,
    CallToActionHandledProps as MSFTCallToActionHandledProps,
    CallToActionManagedClasses,
    CallToActionProps as MSFTCallToActionProps,
    CallToActionUnhandledProps,
} from "./call-to-action";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const CallToAction = manageJss(CallToActionStyles)(MSFTCallToAction);
type CallToAction = InstanceType<typeof CallToAction>;

interface CallToActionHandledProps
    extends Subtract<MSFTCallToActionHandledProps, CallToActionManagedClasses> {}
type CallToActionProps = ManagedJSSProps<
    MSFTCallToActionProps,
    CallToActionClassNameContract,
    DesignSystem
>;

export {
    CallToAction,
    CallToActionAppearance,
    CallToActionProps,
    CallToActionClassNameContract,
    CallToActionHandledProps,
    CallToActionUnhandledProps,
};
