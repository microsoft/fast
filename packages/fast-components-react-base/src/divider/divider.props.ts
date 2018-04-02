import * as React from "react";

/**
 * Button HTML tags
 */
export enum ButtonHTMLTags {
    a = "a",
    button = "button"
}

export interface IDividerProps {
    /**
     * The HTML tag (defaults to ButtonHTMLTags.button)
     */
    tag?: ButtonHTMLTags;

    children?: React.ReactNode | React.ReactNode[];
}