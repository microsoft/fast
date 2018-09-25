import * as React from "react";
import { ICaptionClassNameContract, IManagedClasses  } from "@microsoft/fast-components-class-name-contracts-msft";

export enum CaptionSize {
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
     * The visual size (type level) which aligns to a type ramp instance
     */
    size?: CaptionSize;

    /**
     * The caption tag maps to appropriate HTML tag type depending on context
     */
    tag?: CaptionTag;
}

export interface ICaptionUnhandledProps extends
    React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement | HTMLElement> {}
export interface ICaptionManagedClasses extends IManagedClasses<ICaptionClassNameContract> {}
export type CaptionProps = ICaptionHandledProps & ICaptionUnhandledProps & ICaptionManagedClasses;
