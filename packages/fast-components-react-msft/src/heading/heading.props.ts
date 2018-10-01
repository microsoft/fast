import * as React from "react";
import { ITypographyUnhandledProps } from "../typography";
import { IHeadingClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";

export enum AlignHeadingBaseline {
    small = "small",
    large = "large"
}

export enum HeadingSize {
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

export interface IHeadingManagedClasses extends IManagedClasses<IHeadingClassNameContract> {}
export interface IHeadingHandledProps extends IHeadingManagedClasses {
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
    tag: HeadingTag;
}

/* tslint:disable-next-line:no-empty-interface */
export interface IHeadingUnhandledProps extends ITypographyUnhandledProps {}
export type HeadingProps = IHeadingHandledProps & IHeadingUnhandledProps;
