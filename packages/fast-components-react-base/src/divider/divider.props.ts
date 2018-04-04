import * as React from "react";

/**
 * Divider HTML Roles
 */
export enum DividerRole {
    presentation = 'presentation',
    separator = 'separator'
}

export interface IDividerHandledProps {

    /**
     * The option to set HTML role attribute.
     */
    role?: DividerRole;
}
