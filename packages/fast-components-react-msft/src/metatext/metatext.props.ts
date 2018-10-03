import * as React from "react";
import { IManagedClasses, IMetatextClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ITypographyUnhandledProps } from "../typography";

export enum MetatextTag {
    p = "p",
    span = "span"
}

export interface IMetatextManagedClasses extends IManagedClasses<IMetatextClassNameContract> {}
export interface IMetatextHandledProps extends IMetatextManagedClasses {
    /**
     * The metatext content
     */
    children?: React.ReactNode;

    /**
     * The metatext tag
     */
    tag?: MetatextTag;
}

/* tslint:disable-next-line:no-empty-interface */
export interface IMetatextUnhandledProps extends ITypographyUnhandledProps {}
export type MetatextProps = IMetatextHandledProps & IMetatextUnhandledProps;
