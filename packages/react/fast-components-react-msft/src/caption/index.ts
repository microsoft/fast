import React from "react";
import { CaptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { CaptionStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import captionSchema from "./caption.schema";
import captionSchema2 from "./caption.schema.2";
import MSFTCaption, {
    CaptionManagedClasses,
    CaptionSize,
    CaptionTag,
    CaptionUnhandledProps,
    CaptionHandledProps as MSFTCaptionHandledProps,
    CaptionProps as MSFTCaptionProps,
} from "./caption";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Caption = manageJss(CaptionStyles)(MSFTCaption);
type Caption = InstanceType<typeof Caption>;

type CaptionHandledProps = Subtract<MSFTCaptionHandledProps, CaptionManagedClasses>;
type CaptionProps = ManagedJSSProps<
    MSFTCaptionProps,
    CaptionClassNameContract,
    DesignSystem
>;

export {
    Caption,
    CaptionProps,
    CaptionSize,
    CaptionTag,
    CaptionClassNameContract,
    CaptionHandledProps,
    captionSchema,
    captionSchema2,
    CaptionUnhandledProps,
};
