import { css } from "@microsoft/fast-element";
import { neutralFillRest, outlineWidth } from "../design-tokens";

export const DataGridRowStyles = css`
    :host {
        display: grid;
        padding: 1px 0;
        box-sizing: border-box;
        width: 100%;
        border-bottom: calc(${outlineWidth} * 1px) solid var(--neutral-divider-rest);
    }

    :host(.header) {
    }

    :host(.sticky-header) {
        background: ${neutralFillRest};
        position: sticky;
        top: 0;
    }
`;
