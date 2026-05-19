import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        margin: 8px 0;
    }

    .filters {
        display: flex;
        gap: 4px;
    }

    button {
        background: #f3f3f3;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 13px;
        cursor: pointer;
        color: #444;
    }

    button:hover {
        background: #ececec;
    }

    button.active {
        background: #4a90e2;
        color: white;
        border-color: #4a90e2;
    }
`;
