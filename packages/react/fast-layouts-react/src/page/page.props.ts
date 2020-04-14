import React from "react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { GridDisplay } from "../utilities";
import { PageClassNamesContract } from "./page";

export type PageManagedClasses = ManagedClasses<PageClassNamesContract>;
export type PageUnhandledProps = React.HTMLAttributes<HTMLDivElement>;
export interface PageHandledProps extends PageManagedClasses {
    /**
     * The left and right page margin values
     */
    margin?: string;

    /**
     * The max width of the page
     */
    maxWidth?: string;

    /**
     * The value assigned to the CSS display property
     * Provide this prop when doing server side rendering
     */
    cssGridPropertyName?: GridDisplay;
}

export type PageProps = PageHandledProps & PageUnhandledProps;
