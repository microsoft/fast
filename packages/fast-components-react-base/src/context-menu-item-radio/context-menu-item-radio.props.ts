import * as React from "react";
import { IContextMenuItemRadioClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts";

export interface IContextMenuItemRadioHandledProps {
    /**
     * The id attribute of the context-menu-item-radio
     */
    id: string;

    /**
     * The checked state of the radio item
     */
    checked: boolean;

    /**
     * The children of the context-menu-item-radio
     */
    children?: React.ReactNode;

    /**
     * Callback back to call when the radio item's checked value should be changed
     * TODO: These types are incompatabile with native react names - what should we change this to? update?
     */
    onChange: (component: React.ReactElement<ContextMenuItemRadioProps>) => void;
}

export interface IContextMenuItemRadioUnhandledProps extends React.LiHTMLAttributes<HTMLLIElement> {}
export interface IContextMenuItemRadioManagedClasses extends IManagedClasses<IContextMenuItemRadioClassNameContract> {}
export type ContextMenuItemRadioProps = IContextMenuItemRadioHandledProps & IContextMenuItemRadioUnhandledProps & IContextMenuItemRadioManagedClasses;
