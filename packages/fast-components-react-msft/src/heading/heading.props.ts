import React from "react";
import {
    HeadingClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export enum HeadingAlignBaseline {
    small = "small",
    large = "large",
}

export enum HeadingSize {
    _1 = 1,
    _2 = 2,
    _3 = 3,
    _4 = 4,
    _5 = 5,
    _6 = 6,
    _7 = 7,
}

export enum HeadingTag {
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4",
    h5 = "h5",
    h6 = "h6",
    p = "p",
}

export type HeadingManagedClasses = ManagedClasses<HeadingClassNameContract>;
export interface HeadingHandledProps extends HeadingManagedClasses {
    /**
     * The heading content
     */
    children?: React.ReactNode;

    /**
     * The heading size
     */
    size?: HeadingSize;

    /**
     * The heading tag
     */
    tag?: HeadingTag;
}

export type HeadingUnhandledProps = React.HTMLAttributes<
    HTMLHeadingElement | HTMLParagraphElement
>;
export type HeadingProps = HeadingHandledProps & HeadingUnhandledProps;
