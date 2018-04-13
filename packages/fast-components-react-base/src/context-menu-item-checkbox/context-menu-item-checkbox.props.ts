import * as React from "react";
import { IContextMenuItemCheckboxClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts";

export interface IContextMenuItemCheckboxHandledProps {
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
     */
    onChange: (component: React.ReactElement<ContextMenuItemCheckboxProps>) => void;

}

export interface IContextMenuItemCheckboxUnhandledProps extends React.LiHTMLAttributes<HTMLLIElement> {}
export interface IContextMenuItemCheckboxManagedClasses extends IManagedClasses<IContextMenuItemCheckboxClassNameContract> {}
export type ContextMenuItemCheckboxProps = IContextMenuItemCheckboxHandledProps & IContextMenuItemCheckboxUnhandledProps & IContextMenuItemCheckboxManagedClasses;
