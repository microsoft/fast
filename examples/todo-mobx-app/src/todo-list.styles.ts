import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        margin: 12px 0;
    }

    .todo-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .todo-row {
        border-bottom: 1px solid #eee;
    }

    .todo-row:last-child {
        border-bottom: none;
    }
`;
