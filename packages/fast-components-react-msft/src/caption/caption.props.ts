import * as React from "react";
import { ICaptionClassNameContract, IManagedClasses  } from "@microsoft/fast-components-class-name-contracts-msft";
import { Subtract } from "utility-types";

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

export interface ICaptionManagedClasses extends IManagedClasses<ICaptionClassNameContract> {}
export interface ICaptionHandledProps extends ICaptionManagedClasses {
    /**
     * The caption content
     */
    children?: React.ReactNode;

    /**
     * The visual size (type level) which aligns to a type ramp instance
     */
    size?: CaptionSize;

    /**
     * The caption tag maps to appropriate HTML tag type depending on context
     */
    tag?: CaptionTag;
}

export interface ICaptionUnhandledProps extends React.HTMLAttributes<
    HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement | HTMLElement
> {}
export type CaptionProps = ICaptionHandledProps & ICaptionUnhandledProps;
