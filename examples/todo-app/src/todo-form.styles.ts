import { css } from "@microsoft/fast-element";

export const styles = css`
    form {
        display: flex;
        align-items: center;
        gap: var(--fast-spacing-sm);
        margin: var(--fast-spacing-md) 0;
    }

    input[type="text"] {
        flex: 1;
        min-width: 0;
        background: var(--fast-color-background-default);
        color: var(--fast-color-foreground-default);
        border: var(--fast-border-width-sm) solid
            var(--fast-color-border-default);
        border-radius: var(--fast-radius-md);
        padding: var(--fast-spacing-2xs)
            var(--fast-spacing-sm);
        font-family: var(--fast-font-family-base);
        font-size: var(--fast-font-size-body-1);
        line-height: var(--fast-line-height-body-1);
    }

    input[type="text"]:focus-visible {
        border-color: var(--fast-color-accent-border);
        outline: var(--fast-border-width-md) solid
            var(--fast-color-accent-border);
        outline-offset: var(--fast-border-width-sm);
    }

    button[type="submit"] {
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

    button[type="submit"]:hover {
        background: var(--fast-color-accent-default-hover);
    }

    button[type="submit"]:active {
        background: var(--fast-color-accent-default-active);
    }

    button[type="submit"]:focus-visible {
        outline: var(--fast-border-width-md) solid
            var(--fast-color-accent-border);
        outline-offset: var(--fast-border-width-sm);
    }

    button[type="submit"]:disabled {
        background: var(--fast-color-background-disabled);
        color: var(--fast-color-foreground-disabled);
        border-color: var(--fast-color-border-disabled);
        cursor: not-allowed;
    }
`;
