import * as React from "react";
import { ImageClassNameContract, ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface ImageUnhandledProps extends React.HTMLAttributes<HTMLImageElement | HTMLPictureElement> {}
export interface ImageManagedClasses extends ManagedClasses<ImageClassNameContract> {}
export interface ImageHandledProps extends ImageManagedClasses {
    /**
     * The HTML alt attribute value is important for overall accessibility, providing a textual
     * alternative to non-text content
     */
    alt: string;

    /**
     * The HTML sizes attribute for the image element
     */
    sizes?: string;

    /**
     * The HTML src attribute for the image element
     */
    src?: string;

    /**
     * The HTML srcSet attribute for the image element
     */
    srcSet?: string;

    /**
     * The image children
     */
    children?: React.ReactElement<HTMLSourceElement> | Array<React.ReactElement<HTMLSourceElement>>;
}

export type ImageProps = ImageHandledProps & ImageUnhandledProps;
