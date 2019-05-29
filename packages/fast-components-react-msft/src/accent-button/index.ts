import React from "react";
import { AccentButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { AccentButtonStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTAccentButton, {
    AccentButtonHandledProps as MSFTAccentButtonHandledProps,
    AccentButtonManagedClasses,
    AccentButtonProps as MSFTAccentButtonProps,
    AccentButtonUnhandledProps,
} from "./accent-button";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const AccentButton = manageJss(AccentButtonStyles)(MSFTAccentButton);
type AccentButton = InstanceType<typeof AccentButton>;

interface AccentButtonHandledProps
    extends Subtract<MSFTAccentButtonHandledProps, AccentButtonManagedClasses> {}
type AccentButtonProps = ManagedJSSProps<
    MSFTAccentButtonProps,
    AccentButtonClassNameContract,
    DesignSystem
>;

export {
    AccentButton,
    AccentButtonProps,
    AccentButtonClassNameContract,
    AccentButtonHandledProps,
    AccentButtonUnhandledProps,
};
