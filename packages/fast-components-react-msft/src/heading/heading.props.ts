import * as React from "react";
import { IHeadingClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";

export enum AlignHeadingBaseline {
    small = "small",
    large = "large"
}

export enum HeadingLevel {
    _1 = 1,
    _2 = 2,
    _3 = 3,
    _4 = 4,
    _5 = 5,
    _6 = 6
}

export enum HeadingTag {
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4",
    h5 = "h5",
    h6 = "h6",
    p = "p"
}

export interface IHeadingHandledProps {
    /**
     * The heading content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The heading level
     */
    level?: HeadingLevel;

    /**
     * The heading tag
     */
    tag: HeadingTag;
}

export interface IHeadingUnhandledProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {}
export interface IHeadingManagedClasses extends IManagedClasses<IHeadingClassNameContract> {}
export type HeadingProps = IHeadingHandledProps & IHeadingUnhandledProps & IHeadingManagedClasses;
