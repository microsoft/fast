import * as React from "react";

/**
 * Button HTML tags
 */
export enum ButtonHTMLTags {
    a = "a" as any,
    button = "button" as any
}

export interface IButtonProps extends React.HTMLProps<HTMLButtonElement | HTMLAnchorElement> {
    /**
     * The HTML tag
     */
    tag?: ButtonHTMLTags;
}
