import * as React from "react";
import {
    IFoundationProps,
    IImageClassNameContract,
    IImageHandledProps,
    IImageUnhandledProps,
    Image as BaseImage
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, ImageStyles } from "@microsoft/fast-components-styles-msft";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Image =  manageJss(ImageStyles)(BaseImage);
type Image = InstanceType<typeof Image>;

export { Image };
