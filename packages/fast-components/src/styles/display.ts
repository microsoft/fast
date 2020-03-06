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

const cache: { [key: string]: ReturnType<typeof css> } = {};

/**
 * Apply the common styles for every component
 * @param display The CSS display property value
 */
export function display(displayValue: CSSDisplayPropertyValue): ReturnType<typeof css> {
    if (cache.hasOwnProperty(displayValue)) {
        return cache[displayValue];
    }

    const style = css`
        ${hidden} :host {
            display: ${displayValue};
        }
    `;

    cache[displayValue] = style;

    return style;
}

/* tslint:disable */
