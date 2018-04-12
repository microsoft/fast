import * as React from "react";
import { IManagedClasses, IToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts";

export interface IToggleHandledProps {
    /**
     * Label content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * Disabled state
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
     * The toggle selected state
     */
    selected?: boolean;

    /**
     * The text to display when selected
     */
    selectedString: string;

    /**
     * The selections status HTML id attribute
     */
    statusLabelId: string;

    /**
     * The text to display when unselected
     */
    unselectedString: string;
}

export interface IToggleUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IToggleManagedClasses extends IManagedClasses<IToggleClassNameContract> {}
export type ToggleProps = IToggleHandledProps & IToggleUnhandledProps & IToggleManagedClasses;
