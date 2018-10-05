import * as React from "react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { PageClassNamesContract } from "./page";

export interface PageHandledProps {
    /**
     * The left and right page margin values
     */
    margin?: string;

    /**
     * The max width of the page
     */
    maxWidth?: string;
}

export type PageProps = PageHandledProps & ManagedClasses<PageClassNamesContract>;
