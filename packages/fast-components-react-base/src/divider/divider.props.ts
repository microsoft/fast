import * as React from "react";
import { IDividerClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Divider HTML Roles
 */
export enum DividerRoles {
    presentation = "presentation",
    separator = "separator"
}

export interface IDividerManagedClasses extends IManagedClasses<IDividerClassNameContract> {}
export interface IDividerUnhandledProps extends React.HTMLAttributes<HTMLHRElement> {}
export interface IDividerHandledProps extends IDividerManagedClasses {
    /**
     * The HTML role attribute
     */
    role?: DividerRoles;
}

export type DividerProps = IDividerHandledProps & IDividerUnhandledProps;
