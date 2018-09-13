import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-react-base";
import Caption, {
    CaptionLevel,
    CaptionTag,
    ICaptionHandledProps,
    ICaptionManagedClasses,
    ICaptionUnhandledProps
} from "./caption";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { CaptionStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";

export default manageJss(CaptionStyles)(Caption);
export * from "./caption";
