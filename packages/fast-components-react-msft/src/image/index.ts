import * as React from "react";
import {
    IFoundationProps,
    IImageClassNameContract,
    IImageHandledProps,
    IImageUnhandledProps,
    Image
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, ImageStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(ImageStyles)(Image);
