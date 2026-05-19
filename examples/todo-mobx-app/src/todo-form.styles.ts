import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
    }

    form {
        display: flex;
        gap: 8px;
        margin: 0 0 16px;
    }

    input[type="text"] {
        flex: 1;
        padding: 8px 10px;
        border: 1px solid #d0d0d0;
        border-radius: 4px;
        font-size: 14px;
    }

    input[type="text"]:focus {
        outline: 2px solid #4a90e2;
        outline-offset: -1px;
        border-color: transparent;
    }

    button {
        padding: 8px 16px;
        background: #4a90e2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    }

    button:disabled {
        background: #cdd5df;
        cursor: not-allowed;
    }
`;
