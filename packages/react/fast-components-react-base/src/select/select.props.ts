import React from "react";
import {
    ManagedClasses,
    SelectClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { ListboxItemProps } from "../listbox-item";
import { ViewportPositionerProps } from "../viewport-positioner";
import { SelectState } from "./select";

export type SelectManagedClasses = ManagedClasses<SelectClassNameContract>;
export type SelectUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export type SelectMenuFlyoutConfig = Omit<ViewportPositionerProps, "anchor">;

export interface SelectHandledProps extends SelectManagedClasses {
    /**
     * Custom function to render the trigger of the control
     * (ie. the ui that typically displays the current value and opens the menu in single select mode)
     */
    trigger?: (
        props: SelectProps,
        state: SelectState,
        triggerId?: string
    ) => React.ReactNode;

    /**
     * Custom function to render the menu of the control
     */
    menu?: (
        props: SelectProps,
        state: SelectState,
        defaultMenu: React.ReactNode
    ) => React.ReactNode;

    /**
     * Function which converts and formats the string may be displayed in the ui
     * in the UI
     */
    displayStringFormatter?: (
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
     * Whether to use viewport aware positioning
     * (ie. can open above the trigger if it needs the room)
     */
    enableViewportPositioning?: boolean;

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
        newValue: string | string[],
        selectedItems: ListboxItemProps[],
        displayString: string
    ) => void;

    /**
     * The onMenuSelectionChange event handler
     */
    onMenuSelectionChange?: (selectedItems: ListboxItemProps[]) => void;

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

    /**
     * Configuration props for flyout menu positioning
     */
    menuFlyoutConfig?: SelectMenuFlyoutConfig;
}

export type SelectProps = SelectHandledProps & SelectUnhandledProps;
