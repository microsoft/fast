import React from "react";
import {
    HypertextClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export type HypertextManagedClasses = ManagedClasses<HypertextClassNameContract>;
export type HypertextUnhandledProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
export interface HypertextHandledProps extends HypertextManagedClasses {
    /**
     * The hypertext content
     */
    children?: React.ReactNode;
}

export type HypertextProps = HypertextHandledProps & HypertextUnhandledProps;
