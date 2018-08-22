import * as React from "react";
import { IManagedClasses, IParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

export enum ParagraphLevel {
    _1 = 1,
    _2 = 2,
    _3 = 3
}

export interface IParagraphHandledProps {
    /**
     * The paragraph content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The paragraph level
     */
    level?: ParagraphLevel;
}

export interface IParagraphUnhandledProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface IParagraphManagedClasses extends IManagedClasses<IParagraphClassNameContract> {}
export type ParagraphProps = IParagraphHandledProps & IParagraphUnhandledProps & IParagraphManagedClasses;
