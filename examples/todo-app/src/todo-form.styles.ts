import { css } from "@microsoft/fast-element";

export const styles = css`
    form {
        display: flex;
        align-items: center;
        gap: var(--fast-spacing-horizontal-s);
        margin: var(--fast-spacing-vertical-m) 0;
    }

    input[type="text"] {
        flex: 1;
        min-width: 0;
        background: var(--fast-color-neutral-background-1);
        color: var(--fast-color-neutral-foreground-1);
        border: var(--fast-stroke-width-thin) solid
            var(--fast-color-neutral-stroke-1);
        border-radius: var(--fast-border-radius-medium);
        padding: var(--fast-spacing-vertical-xxs)
            var(--fast-spacing-horizontal-s);
        font-family: var(--fast-font-family-base);
        font-size: var(--fast-font-size-base-300);
        line-height: var(--fast-line-height-base-300);
    }

    input[type="text"]:focus-visible {
        border-color: var(--fast-color-brand-stroke-1);
        outline: var(--fast-stroke-width-thick) solid
            var(--fast-color-brand-stroke-1);
        outline-offset: var(--fast-stroke-width-thin);
    }

    button[type="submit"] {
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

    button[type="submit"]:hover {
        background: var(--fast-color-brand-background-hover);
    }

    button[type="submit"]:active {
        background: var(--fast-color-brand-background-pressed);
    }

    button[type="submit"]:focus-visible {
        outline: var(--fast-stroke-width-thick) solid
            var(--fast-color-brand-stroke-1);
        outline-offset: var(--fast-stroke-width-thin);
    }

    button[type="submit"]:disabled {
        background: var(--fast-color-neutral-background-disabled);
        color: var(--fast-color-neutral-foreground-disabled);
        border-color: var(--fast-color-neutral-stroke-disabled);
        cursor: not-allowed;
    }
`;
