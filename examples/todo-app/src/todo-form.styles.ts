import { css } from "@microsoft/fast-element";

export const styles = css`
    form {
        display: flex;
        align-items: center;
        gap: var(--fast-gap-between-content-x-small);
        margin: var(--fast-gap-between-content-small) 0;
    }

    input[type="text"] {
        flex: 1;
        min-width: 0;
        background: var(--fast-background-layer-primary-solid);
        color: var(--fast-foreground-ctrl-neutral-primary-rest);
        border: var(--fast-stroke-width-default) solid
            var(--fast-stroke-ctrl-on-outline-rest);
        border-radius: var(--fast-corner-medium);
        padding: var(--fast-padding-content-xx-small)
            var(--fast-padding-content-x-small);
        font-family: var(--fast-text-style-default-regular-font-family);
        font-size: var(--fast-text-global-body3-font-size);
        line-height: var(--fast-text-global-body3-line-height);
    }

    input[type="text"]:focus-visible {
        border-color: var(--fast-ctrl-focus-outer-stroke);
        outline: var(--fast-ctrl-focus-outer-stroke-width) solid
            var(--fast-ctrl-focus-outer-stroke);
        outline-offset: var(--fast-stroke-width-default);
    }

    button[type="submit"] {
        background: var(--fast-background-ctrl-brand-rest);
        color: var(--fast-foreground-ctrl-on-brand-rest);
        border: var(--fast-stroke-width-default) solid
            var(--fast-stroke-divider-brand);
        border-radius: var(--fast-corner-medium);
        padding: var(--fast-padding-content-xx-small)
            var(--fast-padding-content-small);
        font-family: inherit;
        font-size: var(--fast-text-global-body3-font-size);
        line-height: var(--fast-text-global-body3-line-height);
        cursor: pointer;
        transition: background var(--fast-duration-fast)
            var(--fast-curve-easy-ease);
    }

    button[type="submit"]:hover {
        background: var(--fast-background-ctrl-brand-hover);
    }

    button[type="submit"]:active {
        background: var(--fast-background-ctrl-brand-pressed);
    }

    button[type="submit"]:focus-visible {
        outline: var(--fast-ctrl-focus-outer-stroke-width) solid
            var(--fast-ctrl-focus-outer-stroke);
        outline-offset: var(--fast-stroke-width-default);
    }

    button[type="submit"]:disabled {
        background: var(--fast-background-ctrl-brand-disabled);
        color: var(--fast-foreground-ctrl-neutral-primary-disabled);
        border-color: var(--fast-stroke-ctrl-on-outline-disabled);
        cursor: not-allowed;
    }
`;
