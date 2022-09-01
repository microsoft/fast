import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        padding: 16px;
        max-width: 320px;
    }

    h2 {
        display: flex;
    }

    .todo-list {
        list-style-type: none;
        padding: 0;
    }

    .todo {
        margin: 8px 0px;
        display: flex;
    }

    .description {
        display: inline-block;
        align-self: center;
        margin: 0px 8px;
        flex: 1;
    }

    .description.done {
        text-decoration: line-through;
    }
`;
