import * as React from "react";
import MSFTCaption, {
    CaptionHandledProps as MSFTCaptionHandledProps,
    CaptionManagedClasses,
    CaptionProps as MSFTCaptionProps,
    CaptionSize,
    CaptionTag,
    CaptionUnhandledProps
} from "./caption";
import { CaptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { CaptionStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Caption = manageJss(CaptionStyles)(MSFTCaption);
type Caption = typeof Caption;

interface CaptionHandledProps extends Subtract<MSFTCaptionHandledProps, CaptionManagedClasses> {}
type CaptionProps = ManagedJSSProps<MSFTCaptionProps, CaptionClassNameContract, DesignSystem>;

export {
    Caption,
    CaptionProps,
    CaptionSize,
    CaptionTag,
    CaptionClassNameContract,
    CaptionHandledProps,
    CaptionUnhandledProps,
};
