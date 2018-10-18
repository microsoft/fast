import * as React from "react";
import {
    CaptionClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { Subtract } from "utility-types";

export enum CaptionSize {
    _1 = 1,
    _2 = 2,
}

export enum CaptionTag {
    p = "p",
    span = "span",
    caption = "caption",
    figcaption = "figcaption",
}

export interface CaptionManagedClasses extends ManagedClasses<CaptionClassNameContract> {}
export interface CaptionHandledProps extends CaptionManagedClasses {
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

export interface CaptionUnhandledProps
    extends React.HTMLAttributes<
            HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement | HTMLElement
        > {}
export type CaptionProps = CaptionHandledProps & CaptionUnhandledProps;
