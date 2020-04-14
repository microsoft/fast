import React from "react";
import {
    ManagedClasses,
    MetatextClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";

export enum MetatextTag {
    p = "p",
    span = "span",
}

export type MetatextManagedClasses = ManagedClasses<MetatextClassNameContract>;
export interface MetatextHandledProps extends MetatextManagedClasses {
    /**
     * The metatext content
     */
    children?: React.ReactNode;

    /**
     * The metatext tag
     */
    tag?: MetatextTag;
}

export type MetatextUnhandledProps = React.HTMLAttributes<
    HTMLParagraphElement | HTMLSpanElement
>;
export type MetatextProps = MetatextHandledProps & MetatextUnhandledProps;
