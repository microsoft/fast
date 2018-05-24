import * as React from "react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IPageClassNamesContract } from "./page";

export interface IPageHandledProps {
    /**
     * The left and right page margin values
     */
    margin?: string;

    /**
     * The max width of the page
     */
    maxWidth?: string;
}

export type PageProps = IPageHandledProps & IManagedClasses<IPageClassNamesContract> & React.HTMLAttributes<HTMLDivElement>;
