import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    Image as BaseImage,
    ImageHandledProps as BaseImageHandledProps,
    ImageProps as BaseImageProps,
    ImageClassNameContract,
    ImageManagedClasses,
    ImageSlot,
    ImageUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, ImageStyles } from "@microsoft/fast-components-styles-msft";
import imageSchema from "./image.schema";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Image = manageJss(ImageStyles)(BaseImage);
type Image = InstanceType<typeof Image>;

type ImageHandledProps = Omit<BaseImageHandledProps, keyof ImageManagedClasses>;
type ImageProps = ManagedJSSProps<BaseImageProps, ImageClassNameContract, DesignSystem>;

export {
    ImageClassNameContract,
    ImageHandledProps,
    ImageUnhandledProps,
    Image,
    ImageProps,
    imageSchema,
    ImageSlot,
};
