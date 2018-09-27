import * as React from "react";
import { IManagedClasses, IToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

export interface IToggleHandledProps {
    /**
     * The label content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * The toggle HTML id attribute
     */
    id: string;

    /**
     * The HTML id attribute associated with the label
     */
    labelId?: string;

    /**
     * The onChange event handler
     */
    onChange?: ToggleOnChange;

    /**
     * The toggle selected state
     */
    selected?: boolean;

    /**
     * The text to display when selected
     */
    selectedMessage: string;

    /**
     * The status label HTML id attribute
     */
    statusMessageId: string;

    /**
     * The text to display when unselected
     */
    unselectedMessage: string;
}

export interface IToggleUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export type ToggleOnChange = (event?: React.ChangeEvent<HTMLElement>) => void;
export interface IToggleManagedClasses extends IManagedClasses<IToggleClassNameContract> {}
export type ToggleProps = IToggleHandledProps & IToggleUnhandledProps & IToggleManagedClasses;
