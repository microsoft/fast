import React from "react";
import {
    ManagedClasses,
    SubheadingClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";

export enum SubheadingSize {
    _1 = 1,
    _2 = 2,
    _3 = 3,
    _4 = 4,
    _5 = 5,
    _6 = 6,
    _7 = 7,
}

export enum SubheadingTag {
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4",
    h5 = "h5",
    h6 = "h6",
    p = "p",
}

export type SubheadingManagedClasses = ManagedClasses<SubheadingClassNameContract>;
export interface SubheadingHandledProps extends SubheadingManagedClasses {
    /**
     * The subheading content
     */
    children?: React.ReactNode;

    /**
     * The visual size (type level) which aligns to a type ramp instance
     */
    size?: SubheadingSize;

    /**
     * The subheading tag used to create the underlying html element
     */
    tag?: SubheadingTag;
}

export type SubheadingUnhandledProps = React.HTMLAttributes<
    HTMLHeadingElement | HTMLParagraphElement
>;
export type SubheadingProps = SubheadingHandledProps & SubheadingUnhandledProps;
