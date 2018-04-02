import * as React from "react";

/**
 * Hypertext HTML tags
 */
export enum HypertextHTMLTags {
    a = "a",
}

export interface IHypertextProps {

    id?: string;

    text?: string;

    href?: string;

    ariaLabel?: string;

    onClick?: (event?: React.MouseEvent<HTMLElement>) => void;

    children?: React.ReactNode | React.ReactNode[];
}
