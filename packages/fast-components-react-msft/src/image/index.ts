import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    IImageClassNameContract,
    IImageHandledProps as IBaseImageHandledProps,
    IImageManagedClasses,
    IImageUnhandledProps,
    Image as BaseImage,
    ImageProps as IBaseImageProps,
    ImageSlot
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, ImageStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Image = manageJss(ImageStyles)(BaseImage);
type Image = typeof Image;

interface IImageHandledProps extends Subtract<IBaseImageHandledProps, IImageManagedClasses> {}
type ImageProps = ManagedJSSProps<IBaseImageProps, IImageClassNameContract, IDesignSystem>;

export {
    IImageClassNameContract,
    IImageHandledProps,
    IImageUnhandledProps,
    Image,
    ImageProps,
    ImageSlot
};
