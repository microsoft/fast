import * as React from "react";
import {
    ManagedClasses,
    SelectClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { ListboxItemProps } from "../listbox-item";

export interface SelectManagedClasses extends ManagedClasses<SelectClassNameContract> {}
export interface SelectUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface SelectHandledProps extends SelectManagedClasses {
    /**
     * The children populate the select menu, any SelectOption components in the
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * Function which renders the base display of the control
     */
    contentDisplayRenderFunction?: (
        selectedItems: ListboxItemProps[],
        value: string,
        displayString: string,
        props: SelectProps
    ) => React.ReactNode;

    /**
     * Function which converts and formats the selected options to a the string value to be returned by the control
     * (ie. what gets sent back as a form result)
     */
    dataValueFormatterFunction?: (
        selectedOptions: ListboxItemProps[],
        selectName: string
    ) => string;

    /**
     * Function which converts and formats the string may be displayed in the ui
     * in the UI
     */
    displayStringFormatterFunction?: (
        selectedOptions: ListboxItemProps[],
        placeholder: string
    ) => string;

    /**
     * Selected option id's (controlled mode)
     */
    selectedItems?: string[] | ListboxItemProps[];

    /**
     * Id's that are initially selected
     */
    defaultSelection?: string[] | ListboxItemProps[];

    /**
     * Specifies that the drop-down list is open
     */
    isMenuOpen?: boolean;

    /**
     * Specifies that the control is disabled
     */
    disabled?: boolean;

    /**
     * Defines one or more forms the select field belongs to
     */
    form?: string;

    /**
     * Specifies that multiple options can be selected at once
     */
    multiselectable?: boolean;

    /**
     * Defines a name for the drop-down list
     */
    name?: string;

    /**
     * String displayed when there is no selected value
     */
    placeholder?: string;

    /**
     * Specifies that the user is required to select a value before submitting the form
     */
    required?: boolean;

    /**
     * The onValueChange event handler
     */
    onValueChange?: (
        newValue: string,
        selectedItems: ListboxItemProps[],
        displayString: string
    ) => void;

    /**
     * Whether a listitem should automatically get focus when this component is mounted
     * (multi-select only)
     */
    autoFocus?: boolean;

    /**
     * The aria-labelledby attribute to link the select to an existing
     * element that provides it an accessible name
     */
    labelledBy?: string;
}

export type SelectProps = SelectHandledProps & SelectUnhandledProps;
