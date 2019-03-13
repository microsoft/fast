import * as React from "react";
import {
    ListboxClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";
import { ListboxItemProps } from "../listbox-item";

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
     * Enable type ahead
     */
    typeAheadEnabled?: boolean;

    /**
     * Whether this listbox supports multi-selection (default is 'false')
     */
    multiselectable?: boolean;

    /**
     * The aria-labelledby attribute to link the listbox to an existing
     * element that provides it an accessible name
     */
    labelledBy?: string;

    /**
     * Selected options(controlled mode)
     */
    selectedItems?: string[] | ListboxItemProps[];

    /**
     * Options that are initially selected
     */
    defaultSelection?: string[] | ListboxItemProps[];

    /**
     * The  onSelectedItemsChanged event handler
     */
    onSelectedItemsChanged?: (selectedItems: ListboxItemProps[]) => void;

    /**
     * The onItemInvoked event handler
     */
    onItemInvoked?: (item: ListboxItemProps) => void;

    /**
     * Whether a listitem should automatically get focus when this component is mounted
     */
    focusItemOnMount?: boolean;

    /**
     * Specifies that the control is disabled
     */
    disabled?: boolean;
}

export type ListboxProps = ListboxHandledProps & ListboxUnhandledProps;
