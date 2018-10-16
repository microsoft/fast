import * as React from "react";
import { ContextMenuItemCheckboxClassNameContract, ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface ContextMenuItemCheckboxUnhandledProps extends React.LiHTMLAttributes<HTMLLIElement> {}
export interface ContextMenuItemCheckboxManagedClasses extends ManagedClasses<ContextMenuItemCheckboxClassNameContract> {}
export interface ContextMenuItemCheckboxHandledProps extends ContextMenuItemCheckboxManagedClasses {
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

export type ContextMenuItemCheckboxProps = ContextMenuItemCheckboxHandledProps & ContextMenuItemCheckboxUnhandledProps;
