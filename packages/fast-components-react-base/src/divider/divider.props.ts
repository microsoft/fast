import * as React from "react";

/**
 * Divider HTML Roles
 */
export enum DividerRole {
    presentation = 'presentation',
    separator = 'separator'
}

export interface IDividerProps {

    /**
     * The option to set HTML role attribute.
     */
    role?: DividerRole;
}