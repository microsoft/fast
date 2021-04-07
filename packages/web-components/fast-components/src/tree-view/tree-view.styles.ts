import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

/**
 * Styles for the {@link FASTTreeView|FASTTreeView component}.
 *
 * @public
 */
export const TreeViewStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    ${display("flex")} :host {
        flex-direction: column;
        align-items: stretch;
        min-width: fit-content;
        font-size: 0;
    }

    :host:focus-visible {
        outline: none;
    }
`;
