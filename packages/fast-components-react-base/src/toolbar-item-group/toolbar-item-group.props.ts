import React from "react";
import {
    ManagedClasses,
    ToolbarItemGroupClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { Orientation } from "@microsoft/fast-web-utilities";

export interface ToolbarItemGroupManagedClasses
    extends ManagedClasses<ToolbarItemGroupClassNameContract> {}
export interface ToolbarItemGroupUnhandledProps
    extends React.HTMLAttributes<HTMLDivElement> {}
export interface ToolbarItemGroupHandledProps extends ToolbarItemGroupManagedClasses {
    /**
     * The toolbar item group children
     */
    children?: React.ReactNode;

    /**
     *
     */
    itemPath?: number[];

    /**
     *
     */
    currentFocusPath?: string;
}

export type ToolbarItemGroupProps = ToolbarItemGroupHandledProps &
    ToolbarItemGroupUnhandledProps;
