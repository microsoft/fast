import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        margin-top: 12px;
        border-top: 1px solid #eee;
        padding-top: 12px;
    }

    .stats {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 13px;
        color: #555;
    }

    .count {
        flex: 1;
    }

    button {
        background: transparent;
        border: 1px solid #d0d0d0;
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 13px;
        cursor: pointer;
        color: #555;
    }

    button:hover {
        background: #f3f3f3;
    }

    .clear-completed {
        color: #c0392b;
        border-color: #f0c5be;
    }

    .clear-completed:hover {
        background: #fdecea;
    }
`;
