import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import MSFTCaption, {
    CaptionSize,
    CaptionTag,
    ICaptionClassNameContract,
    ICaptionHandledProps,
    ICaptionManagedClasses,
    ICaptionUnhandledProps
} from "./caption";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { CaptionStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Caption = manageJss(CaptionStyles)(MSFTCaption);
type Caption = InstanceType<typeof Caption>;

export { Caption };
