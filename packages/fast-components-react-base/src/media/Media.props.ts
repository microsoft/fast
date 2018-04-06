import * as React from "react";
import {IManagedClasses, IMediaClassNameContract} from "@microsoft/fast-components-class-name-contracts";

export interface IMediaSourceSet {
    /**
     * The HTML srcSet attribute for the source element
     */
    srcSet: string;

    /**
     * The HTML min-Width attribute for the source element
     */
    minWidth?: string;

    /**
     * The HTML max-Width attribute for the source element
     */
    maxWidth?: string;
}

export interface IMediaHandledProps {
    /**
     * The HTML alt attribute value is important for overall accessibility, providing a textual
     * alternative to non-text content
     */
    alt?: string;

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
     * The HTML src attribute for the image element (specifying src will chose the image element rather than the picture element)
     */
    src?: string;

    /**
     * The mediaSrcSet generates HTML srcSet attribute for the image and source element
     */
    mediaSrcSet?: IMediaSourceSet[];

    /**
     * The HTML sizes attribute for the image element
     */
    sizes?: string;
}

export interface IMediaUnhandledProps extends React.HTMLAttributes<HTMLImageElement | HTMLPictureElement> {}
export interface IMediaMangedClasses extends IManagedClasses<IMediaClassNameContract> {}
export type MediaProps = IMediaHandledProps & IMediaUnhandledProps & IMediaMangedClasses;
