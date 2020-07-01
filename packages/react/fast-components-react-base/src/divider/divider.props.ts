import React from "react";
import {
    DividerClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Divider HTML Roles
 */
export enum DividerRoles {
    presentation = "presentation",
    separator = "separator",
}

export type DividerManagedClasses = ManagedClasses<DividerClassNameContract>;
export type DividerUnhandledProps = Omit<React.HTMLAttributes<HTMLHRElement>, "role">;
export interface DividerHandledProps extends DividerManagedClasses {
    /**
     * The HTML role attribute
     */
    role?: DividerRoles;
}

export type DividerProps = DividerHandledProps & DividerUnhandledProps;
