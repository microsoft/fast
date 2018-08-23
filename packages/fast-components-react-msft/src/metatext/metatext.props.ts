import * as React from "react";
import { IManagedClasses, IMetatextClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

export enum MetatextTag {
    p = "p",
    span = "span"
}

export interface IMetatextHandledProps {
    /**
     * The metatext content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The metatext tag
     */
    tag: MetatextTag;
}

export interface IMetatextUnhandledProps extends React.HTMLAttributes<HTMLSpanElement | HTMLParagraphElement> {}
export interface IMetatextManagedClasses extends IManagedClasses<IMetatextClassNameContract> {}
export type MetatextProps = IMetatextHandledProps & IMetatextUnhandledProps & IMetatextManagedClasses;
