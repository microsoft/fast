import * as React from "react";

/**
 * Button HTML tags
 */
export enum ButtonHTMLTags {
    a = "a" as any,
    button = "button" as any
}

export interface IButtonProps {
    /**
     * The HTML tag (defaults to ButtonHTMLTags.button)
     */
    tag?: ButtonHTMLTags;
}
