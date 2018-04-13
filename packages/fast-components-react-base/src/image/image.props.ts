import * as React from "react";
import { IImageClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IImageHandledProps {
    /**
     * The HTML alt attribute value is important for overall accessibility, providing a textual
     * alternative to non-text content
     */
    alt: string;

    /**
     * The HTML itemScope attribute defines the scope of associated metadata and is used for associating the
     * element context with definitions on schema.org (important for seach engine optimization)
     */
    itemScope?: boolean;

    /**
     * The round image option
     */
    round?: boolean;

    /**
     * The HTML sizes attribute for the image element
     */
    sizes?: string;

    /**
     * The HTML src attribute for the image element (specifying src will chose the image element rather than the picture element)
     */
    src?: string;

    /**
     * The HTML srcSet attribute for the image element
     */
    srcSet?: string;

    /**
     * The viewport 1 (320px-539px) source address
     */
    vp1?: string;

    /**
     * The viewport 2 (540px-767px) source address
     */
    vp2?: string;

    /**
     * The viewport 3 (768px-1083px) source address
     */
    vp3?: string;

    /**
     * The viewport 4 (1084px-1399px) source address
     */
    vp4?: string;

    /**
     * The viewport 5 (1400px-1778px) source address
     */
    vp5?: string;

    /**
     * The viewport 6 (1779px+) source address
     */
    vp6?: string;
}

export interface IImageUnhandledProps extends React.HTMLAttributes<HTMLImageElement | HTMLPictureElement> {}
export interface IImageMangedClasses extends IManagedClasses<IImageClassNameContract> {}
export type ImageProps = IImageHandledProps & IImageUnhandledProps & IImageMangedClasses;
