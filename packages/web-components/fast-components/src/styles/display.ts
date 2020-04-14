export type CSSDisplayPropertyValue =
    | "block"
    | "contents"
    | "flex"
    | "grid"
    | "inherit"
    | "initial"
    | "inline"
    | "inline-block"
    | "inline-flex"
    | "inline-grid"
    | "inline-table"
    | "list-item"
    | "none"
    | "run-in"
    | "table"
    | "table-caption"
    | "table-cell"
    | "table-column"
    | "table-column-group"
    | "table-footer-group"
    | "table-header-group"
    | "table-row"
    | "table-row-group";

export const hidden = `
    :host([hidden]) {
        display: none;
    }
`;

/**
 * Apply the common styles for every component
 * @param display The CSS display property value
 */
export function display(displayValue: CSSDisplayPropertyValue): string {
    return `
        ${hidden} :host {
            display: ${displayValue};
        }
    `;
}
