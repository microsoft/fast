import * as React from "react";

/**
 * Hyperlink HTML tags
 */
export enum HyperlinkHTMLTags {
    a = "a",
}

export interface IHyperlinkProps {
    /**
     * The HTML tag (defaults to HyperlinkHTMLTags.hyperlink)
     */
    tag?: HyperlinkHTMLTags;

    href?: string;

    children?: React.ReactNode | React.ReactNode[];
}
