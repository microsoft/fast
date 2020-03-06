import { css } from "@microsoft/fast-element";

export type CSSDisplayPropertyValue =
    | "inline"
    | "block"
    | "contents"
    | "flex"
    | "grid"
    | "inline-block"
    | "inline-flex"
    | "inline-grid"
    | "inline-table"
    | "list-item"
    | "run-in"
    | "table"
    | "table-caption"
    | "table-column-group"
    | "table-header-group"
    | "table-footer-group"
    | "table-row-group"
    | "table-cell"
    | "table-column"
    | "table-row"
    | "none"
    | "initial"
    | "inherit";

const hidden = css`
    :host([hidden]) {
        display: none;
    }
`;

/* tslint:disable */
const cache: { [key: string]: ReturnType<typeof css> } = {};

/**
 * Apply the common styles for every component
 * @param display The CSS display property value
 */
export function display(display: CSSDisplayPropertyValue): ReturnType<typeof css> {
    if (cache.hasOwnProperty(display)) {
        return cache[display];
    }

    const style = css`
        ${hidden} :host {
            display: ${display};
        }
    `;

    cache[display] = style;

    return style;
}

/* tslint:disable */
