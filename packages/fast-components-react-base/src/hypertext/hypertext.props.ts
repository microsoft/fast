import React from "react";
import {
    HypertextClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface HypertextManagedClasses
    extends ManagedClasses<HypertextClassNameContract> {}
export interface HypertextUnhandledProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}
export interface HypertextHandledProps extends HypertextManagedClasses {
    /**
     * The hypertext content
     */
    children?: React.ReactNode;
}

export type HypertextProps = HypertextHandledProps & HypertextUnhandledProps;
