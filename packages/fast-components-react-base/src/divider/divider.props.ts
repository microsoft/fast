import * as React from "react";
import { DividerClassNameContract, ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { Omit } from "utility-types";

/**
 * Divider HTML Roles
 */
export enum DividerRoles {
    presentation = "presentation",
    separator = "separator"
}

export interface DividerManagedClasses extends ManagedClasses<DividerClassNameContract> {}
export interface DividerUnhandledProps extends Omit<React.HTMLAttributes<HTMLHRElement>, "role"> {}
export interface DividerHandledProps extends DividerManagedClasses {
    /**
     * The HTML role attribute
     */
    role?: DividerRoles;
}

export type DividerProps = DividerHandledProps & DividerUnhandledProps;
