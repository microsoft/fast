import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        margin: var(--fast-gap-between-content-small) 0;
    }

    .todo-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: var(--fast-gap-between-content-xx-small);
    }

    .todo-row {
        display: block;
    }
`;
