import { IRowClassNamesContract } from "./row";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Possible justify options: 'center' | 'start' | 'end' | 'space-around' | 'space-between'
 * @name RowJustify
 * @typedef {RowJustify}
 * @type {string}
 */
export type RowJustify = "center" | "start" | "end" | "space-around" | "space-between";

/**
 * Defines the possible props for the Row component
 * @interface
 */
export interface IRowHandledProps {
    /**
     * How to justify child content
     * TODO is this necessary? doesn't appear to do anything
     */
    justify?: RowJustify;

    /**
     * Causes the row to fill all available vertical space
     */
    fill?: boolean;
}

export interface IRowManagedClasses extends IManagedClasses<IRowClassNamesContract> {}
export interface IRowUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export type RowProps = IRowHandledProps & IRowUnhandledProps & IRowManagedClasses;
