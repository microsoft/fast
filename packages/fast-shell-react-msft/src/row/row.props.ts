import { IRowClassNamesContract } from "./row";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Defines the possible props for the Row component
 * @interface
 */
export interface IRowHandledProps {
    /**
     * Causes the row to fill all available vertical space
     */
    fill?: boolean;
}

export interface IRowManagedClasses extends IManagedClasses<IRowClassNamesContract> {}
export interface IRowUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export type RowProps = IRowHandledProps & IRowUnhandledProps & IRowManagedClasses;
