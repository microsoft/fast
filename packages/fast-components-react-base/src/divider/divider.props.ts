import * as React from "react";
import { DividerClassNameContract, ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Divider HTML Roles
 */
export enum DividerRoles {
    presentation = "presentation",
    separator = "separator"
}

export interface DividerManagedClasses extends ManagedClasses<DividerClassNameContract> {}
export interface DividerUnhandledProps extends React.HTMLAttributes<HTMLHRElement> {}
export interface DividerHandledProps extends DividerManagedClasses {
    /**
     * The HTML role attribute
     */
    role?: DividerRoles;
}

export type DividerProps = DividerHandledProps & DividerUnhandledProps;
