import * as React from "react";
import {
    IFoundationProps,
    IImageClassNameContract,
    IImageHandledProps,
    IImageUnhandledProps,
    Image
} from "@microsoft/fast-components-react-base";
import manageJss from "@microsoft/fast-jss-manager-react";
import { ImageStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(ImageStyles)(Image);
