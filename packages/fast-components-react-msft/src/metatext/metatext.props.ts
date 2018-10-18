import * as React from "react";
import {
    ManagedClasses,
    MetatextClassNameContract
} from "@microsoft/fast-components-class-name-contracts-msft";
import { TypographyUnhandledProps } from "../typography";

export enum MetatextTag {
    p = "p",
    span = "span"
}

export interface MetatextManagedClasses
    extends ManagedClasses<MetatextClassNameContract> {}
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

/* tslint:disable-next-line:no-empty-interface */
export interface MetatextUnhandledProps extends TypographyUnhandledProps {}
export type MetatextProps = MetatextHandledProps & MetatextUnhandledProps;
