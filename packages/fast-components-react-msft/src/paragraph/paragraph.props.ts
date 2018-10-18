import * as React from "react";
import {
    ManagedClasses,
    ParagraphClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";

export enum ParagraphSize {
    _1 = 1,
    _2 = 2,
    _3 = 3,
}

export interface ParagraphManagedClasses
    extends ManagedClasses<ParagraphClassNameContract> {}
export interface ParagraphHandledProps extends ParagraphManagedClasses {
    /**
     * The paragraph content
     */
    children?: React.ReactNode;

    /**
     * The visual size (type level) which aligns to a type ramp instance
     */
    size?: ParagraphSize;
}

export interface ParagraphUnhandledProps
    extends React.HTMLAttributes<HTMLParagraphElement> {}
export type ParagraphProps = ParagraphHandledProps & ParagraphUnhandledProps;
