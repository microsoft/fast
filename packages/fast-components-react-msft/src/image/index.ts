import * as React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    Image as BaseImage,
    ImageClassNameContract,
    ImageHandledProps as BaseImageHandledProps,
    ImageManagedClasses,
    ImageProps as BaseImageProps,
    ImageSlot,
    ImageUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, ImageStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Image = manageJss(ImageStyles)(BaseImage);
type Image = InstanceType<typeof Image>;

interface ImageHandledProps
    extends Subtract<BaseImageHandledProps, ImageManagedClasses> {}
type ImageProps = ManagedJSSProps<BaseImageProps, ImageClassNameContract, DesignSystem>;

export {
    ImageClassNameContract,
    ImageHandledProps,
    ImageUnhandledProps,
    Image,
    ImageProps,
    ImageSlot,
};
