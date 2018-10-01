import * as React from "react";
import { IManagedClasses, IParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

export enum ParagraphLevel {
    _1 = 1,
    _2 = 2,
    _3 = 3
}

export interface IParagraphManagedClasses extends IManagedClasses<IParagraphClassNameContract> {}
export interface IParagraphHandledProps extends IParagraphManagedClasses {
    /**
     * The paragraph content
     */
    children?: React.ReactNode;

    /**
     * The visual size (type level) which aligns to a type ramp instance
     */
    size?: ParagraphLevel;
}

export interface IParagraphUnhandledProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export type ParagraphProps = IParagraphHandledProps & IParagraphUnhandledProps;
