import React from "react";
import {
    ManagedClasses,
    ToolbarItemGroupClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface ToolbarItemGroupManagedClasses
    extends ManagedClasses<ToolbarItemGroupClassNameContract> {}
export interface ToolbarItemGroupUnhandledProps
    extends React.HTMLAttributes<HTMLDivElement> {}
export interface ToolbarItemGroupHandledProps extends ToolbarItemGroupManagedClasses {
    /**
     * The "address" of the group in the toolbar hierarchy.
     * This prop is set programmatically by the parent toolbar/toolbar-item-group and should
     * not be set directly by authors.
     * (In toolbars with nested item groups the index can be described with an array
     * indicating the the index of the child group(s) in succession
     * ie. [1, 3] places focus on child at index 3 of a group at index 1 of the toolbar root)e4.
     */
    itemPath?: number[];
}

export type ToolbarItemGroupProps = ToolbarItemGroupHandledProps &
    ToolbarItemGroupUnhandledProps;
