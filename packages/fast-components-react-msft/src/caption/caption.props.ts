import * as React from "react";
import { ICaptionClassNameContract, IManagedClasses  } from "@microsoft/fast-components-class-name-contracts-msft";

export enum CaptionLevel {
    _1 = 1,
    _2 = 2
}

export enum CaptionTag {
    p = "p",
    span = "span",
    caption = "caption",
    figcaption = "figcaption"
}

export interface ICaptionHandledProps {
    /**
     * The caption content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The caption level maps to the type ramp
     */
    level?: CaptionLevel;

    /**
     * The caption tag maps to appropriate HTML tag type depending on context
     */
    tag?: CaptionTag;
}

export interface ICaptionUnHandledProps extends
    React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement | HTMLTableCaptionElement> {}
export interface ICaptionManagedClasses extends IManagedClasses<ICaptionClassNameContract> {}
export type CaptionProps = ICaptionHandledProps & ICaptionUnHandledProps & ICaptionManagedClasses;
