import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        padding: var(--fast-spacing-horizontal-l);
        max-width: 480px;
        font-family: var(--fast-font-family-base);
        color: var(--fast-color-neutral-foreground-1);
        background: var(--fast-color-neutral-background-1);
        border: var(--fast-stroke-width-thin) solid
            var(--fast-color-neutral-stroke-2);
        border-radius: var(--fast-border-radius-large);
        box-shadow: var(--fast-shadow-8);
        margin: var(--fast-spacing-vertical-xxl) auto;
    }

    .toolbar {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--fast-spacing-horizontal-s);
    }

    h1 {
        margin: 0 0 var(--fast-spacing-vertical-m);
        font-size: var(--fast-font-size-hero-700);
        line-height: var(--fast-line-height-hero-700);
        font-weight: var(--fast-font-weight-semibold);
        color: var(--fast-color-brand-foreground-1);
    }

    .theme-toggle {
        background: var(--fast-color-brand-background);
        color: var(--fast-color-neutral-foreground-on-brand);
        border: var(--fast-stroke-width-thin) solid
            var(--fast-color-brand-stroke-1);
        border-radius: var(--fast-border-radius-medium);
        padding: var(--fast-spacing-vertical-xs)
            var(--fast-spacing-horizontal-m);
        font-family: inherit;
        font-size: var(--fast-font-size-base-300);
        line-height: var(--fast-line-height-base-300);
        cursor: pointer;
        transition: background var(--fast-duration-fast)
            var(--fast-curve-easy-ease);
    }

    .theme-toggle:hover {
        background: var(--fast-color-brand-background-hover);
    }

    .theme-toggle:active {
        background: var(--fast-color-brand-background-pressed);
    }

    .theme-toggle:focus-visible {
        outline: var(--fast-stroke-width-thick) solid
            var(--fast-color-brand-stroke-1);
        outline-offset: var(--fast-stroke-width-thin);
    }

    section {
        display: flex;
        align-items: center;
        gap: var(--fast-spacing-horizontal-s);
        margin-top: var(--fast-spacing-vertical-m);
        font-size: var(--fast-font-size-base-300);
        line-height: var(--fast-line-height-base-300);
        color: var(--fast-color-neutral-foreground-2);
    }

    select {
        background: var(--fast-color-neutral-background-1);
        color: var(--fast-color-neutral-foreground-1);
        border: var(--fast-stroke-width-thin) solid
            var(--fast-color-neutral-stroke-1);
        border-radius: var(--fast-border-radius-small);
        padding: var(--fast-spacing-vertical-xxs)
            var(--fast-spacing-horizontal-s);
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    select:focus-visible {
        outline: var(--fast-stroke-width-thick) solid
            var(--fast-color-brand-stroke-1);
        outline-offset: var(--fast-stroke-width-thin);
    }

    .todo-list {
        list-style-type: none;
        padding: 0;
        margin: var(--fast-spacing-vertical-m) 0 0;
    }

    .todo {
        margin: var(--fast-spacing-vertical-s) 0;
        padding: var(--fast-spacing-horizontal-s);
        display: flex;
        align-items: center;
        gap: var(--fast-spacing-horizontal-s);
        border-radius: var(--fast-border-radius-medium);
        border: var(--fast-stroke-width-thin) solid
            var(--fast-color-neutral-stroke-divider);
        background: var(--fast-color-neutral-background-2);
        transition: background var(--fast-duration-fast)
            var(--fast-curve-easy-ease);
    }

    .todo:hover {
        background: var(--fast-color-neutral-background-1-hover);
    }

    .description {
        display: inline-block;
        align-self: center;
        margin: 0;
        flex: 1;
        font-size: var(--fast-font-size-base-300);
        line-height: var(--fast-line-height-base-300);
    }

    .description.done {
        text-decoration: line-through;
        color: var(--fast-color-neutral-foreground-3);
    }

    .todo button {
        color: var(--fast-color-status-danger-foreground);
        background: transparent;
        border: none;
        border-radius: var(--fast-border-radius-medium);
        padding: var(--fast-spacing-vertical-xs)
            var(--fast-spacing-horizontal-xs);
        font-family: inherit;
        font-size: var(--fast-font-size-base-300);
        line-height: var(--fast-line-height-base-300);
        cursor: pointer;
        transition: background var(--fast-duration-fast)
            var(--fast-curve-easy-ease);
    }

    .todo button:hover,
    .todo button:active {
        background: var(--fast-color-status-danger-background);
    }

    .todo button:focus-visible {
        outline: var(--fast-stroke-width-thick) solid
            var(--fast-color-status-danger-foreground);
        outline-offset: var(--fast-stroke-width-thin);
    }
`;
