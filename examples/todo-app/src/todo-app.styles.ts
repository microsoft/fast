import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        padding: var(--fast-spacing-lg);
        max-width: 480px;
        font-family: var(--fast-font-family-base);
        color: var(--fast-color-foreground-default);
        background: var(--fast-color-background-default);
        border: var(--fast-border-width-sm) solid
            var(--fast-color-border-subtle);
        border-radius: var(--fast-radius-lg);
        box-shadow: var(--fast-shadow-md);
        margin: var(--fast-spacing-2xl) auto;
    }

    .toolbar {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--fast-spacing-sm);
    }

    h1 {
        margin: 0 0 var(--fast-spacing-md);
        font-size: var(--fast-font-size-title-3);
        line-height: var(--fast-line-height-title-3);
        font-weight: var(--fast-font-weight-semibold);
        color: var(--fast-color-accent-foreground);
    }

    .theme-toggle {
        background: var(--fast-color-accent-default);
        color: var(--fast-color-foreground-on-accent);
        border: var(--fast-border-width-sm) solid
            var(--fast-color-accent-border);
        border-radius: var(--fast-radius-md);
        padding: var(--fast-spacing-xs)
            var(--fast-spacing-md);
        font-family: inherit;
        font-size: var(--fast-font-size-body-1);
        line-height: var(--fast-line-height-body-1);
        cursor: pointer;
        transition: background var(--fast-duration-fast)
            var(--fast-easing-standard);
    }

    .theme-toggle:hover {
        background: var(--fast-color-accent-default-hover);
    }

    .theme-toggle:active {
        background: var(--fast-color-accent-default-active);
    }

    .theme-toggle:focus-visible {
        outline: var(--fast-border-width-md) solid
            var(--fast-color-accent-border);
        outline-offset: var(--fast-border-width-sm);
    }

    section {
        display: flex;
        align-items: center;
        gap: var(--fast-spacing-sm);
        margin-top: var(--fast-spacing-md);
        font-size: var(--fast-font-size-body-1);
        line-height: var(--fast-line-height-body-1);
        color: var(--fast-color-foreground-muted);
    }

    select {
        background: var(--fast-color-background-default);
        color: var(--fast-color-foreground-default);
        border: var(--fast-border-width-sm) solid
            var(--fast-color-border-default);
        border-radius: var(--fast-radius-sm);
        padding: var(--fast-spacing-2xs)
            var(--fast-spacing-sm);
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    select:focus-visible {
        outline: var(--fast-border-width-md) solid
            var(--fast-color-accent-border);
        outline-offset: var(--fast-border-width-sm);
    }

    .todo-list {
        list-style-type: none;
        padding: 0;
        margin: var(--fast-spacing-md) 0 0;
    }

    .todo {
        margin: var(--fast-spacing-sm) 0;
        padding: var(--fast-spacing-sm);
        display: flex;
        align-items: center;
        gap: var(--fast-spacing-sm);
        border-radius: var(--fast-radius-md);
        border: var(--fast-border-width-sm) solid
            var(--fast-color-border-divider);
        background: var(--fast-color-background-canvas);
        transition: background var(--fast-duration-fast)
            var(--fast-easing-standard);
    }

    .todo:hover {
        background: var(--fast-color-background-default-hover);
    }

    .description {
        display: inline-block;
        align-self: center;
        margin: 0;
        flex: 1;
        font-size: var(--fast-font-size-body-1);
        line-height: var(--fast-line-height-body-1);
    }

    .description.done {
        text-decoration: line-through;
        color: var(--fast-color-foreground-subtle);
    }

    .todo button {
        color: var(--fast-color-feedback-danger-foreground);
        background: transparent;
        border: none;
        border-radius: var(--fast-radius-md);
        padding: var(--fast-spacing-xs)
            var(--fast-spacing-xs);
        font-family: inherit;
        font-size: var(--fast-font-size-body-1);
        line-height: var(--fast-line-height-body-1);
        cursor: pointer;
        transition: background var(--fast-duration-fast)
            var(--fast-easing-standard);
    }

    .todo button:hover,
    .todo button:active {
        background: var(--fast-color-feedback-danger-background);
    }

    .todo button:focus-visible {
        outline: var(--fast-border-width-md) solid
            var(--fast-color-feedback-danger-foreground);
        outline-offset: var(--fast-border-width-sm);
    }
`;
