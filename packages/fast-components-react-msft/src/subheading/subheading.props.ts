import * as React from "react";
import { IManagedClasses, ISubheadingClassNameContract  } from "@microsoft/fast-components-class-name-contracts-msft";

export enum SubheadingLevel {
    _1 = 1,
    _2 = 2,
    _3 = 3,
    _4 = 4,
    _5 = 5,
    _6 = 6
}

export enum SubheadingTag {
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4",
    h5 = "h5",
    h6 = "h6",
    p = "p"
}

export interface ISubheadingHandledProps {

    /**
     * The subheading content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The subheading size used to map to typographic level
     */
    size?: SubheadingLevel;

    /**
     * The subheading tag used to create the underlying html element
     */
    tag?: SubheadingTag;
}

export interface ISubheadingUnhandledProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {}
export interface ISubheadingManagedClasses extends IManagedClasses<ISubheadingClassNameContract> {}
export type SubheadingProps = ISubheadingHandledProps & ISubheadingUnhandledProps & ISubheadingManagedClasses;
