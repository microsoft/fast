import * as React from "react";
import { IManagedClasses, IToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

export interface IToggleManagedClasses extends IManagedClasses<IToggleClassNameContract> {}
export interface IToggleUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface IToggleHandledProps extends IToggleManagedClasses {
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
    onChange?: (event?: React.ChangeEvent<HTMLElement>) => void;

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

export type ToggleProps = IToggleHandledProps & IToggleUnhandledProps;
