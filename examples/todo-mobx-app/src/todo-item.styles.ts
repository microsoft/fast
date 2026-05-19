import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
    }

    .todo {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 4px;
    }

    .description {
        flex: 1;
        font-size: 14px;
    }

    .description.done {
        text-decoration: line-through;
        color: #999;
    }

    .remove {
        background: transparent;
        border: none;
        color: #c0392b;
        font-size: 18px;
        cursor: pointer;
        padding: 0 6px;
    }

    .remove:hover {
        color: #962d22;
    }

    input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
    }
`;
