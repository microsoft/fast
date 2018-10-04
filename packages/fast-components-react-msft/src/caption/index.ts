import * as React from "react";
import MSFTCaption, {
    CaptionProps as MSFTCaptionProps,
    CaptionSize,
    CaptionTag,
    ICaptionHandledProps as IMSFTCaptionHandledProps,
    ICaptionManagedClasses,
    ICaptionUnhandledProps
} from "./caption";
import { ICaptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { CaptionStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Caption = manageJss(CaptionStyles)(MSFTCaption);
type Caption = typeof Caption;

interface ICaptionHandledProps extends Subtract<IMSFTCaptionHandledProps, ICaptionManagedClasses> {}
type CaptionProps = ManagedJSSProps<MSFTCaptionProps, ICaptionClassNameContract, IDesignSystem>;

export {
    Caption,
    CaptionProps,
    CaptionSize,
    CaptionTag,
    ICaptionClassNameContract,
    ICaptionHandledProps,
    ICaptionUnhandledProps,
};
