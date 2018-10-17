import * as React from "react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { PageClassNamesContract } from "./page";

export interface PageManagedClasses extends ManagedClasses<PageClassNamesContract> {}
export interface PageUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface PageHandledProps extends PageManagedClasses {
    /**
     * The left and right page margin values
     */
    margin?: string;

    /**
     * The max width of the page
     */
    maxWidth?: string;
}

export type PageProps = PageHandledProps & PageUnhandledProps;
