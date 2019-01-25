import * as React from "react";
import {
    ListboxClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface ListboxManagedClasses extends ManagedClasses<ListboxClassNameContract> {}
export interface ListboxUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ListboxHandledProps extends ListboxManagedClasses {
    /**
     * The listbox children
     */
    children?: React.ReactNode;

    /**
     * The name of the prop on child components that is used as the data for type ahead focus
     */
    typeAheadPropertyKey?: string;

    /**
     * Whether this listbox supports multi-selection (default is 'false')
     */
    multiselectible?: boolean;

    /**
     * The aria-labelledby attribute to link the listbox to an existing
     * element that provides it an accessible name
     */
    labelledBy?: string;
}

export type ListboxProps = ListboxHandledProps & ListboxUnhandledProps;
