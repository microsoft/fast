import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        margin: var(--fast-gap-between-content-x-small) 0;
    }

    .filters {
        display: flex;
        gap: var(--fast-gap-between-content-xx-small);
    }

    button {
        background: var(--fast-background-layer-secondary);
        color: var(--fast-foreground-ctrl-neutral-primary-rest);
        border: var(--fast-stroke-width-default) solid
            var(--fast-stroke-ctrl-on-outline-rest);
        border-radius: var(--fast-corner-medium);
        padding: var(--fast-padding-content-xx-small)
            var(--fast-padding-content-x-small);
        font-family: inherit;
        font-size: var(--fast-text-global-body3-font-size);
        line-height: var(--fast-text-global-body3-line-height);
        cursor: pointer;
        transition: background var(--fast-duration-fast)
            var(--fast-curve-easy-ease);
    }

    button:hover {
        background: var(--fast-background-ctrl-subtle-hover);
    }

    button:active {
        background: var(--fast-background-ctrl-subtle-pressed);
    }

    button:focus-visible {
        outline: var(--fast-ctrl-focus-outer-stroke-width) solid
            var(--fast-ctrl-focus-outer-stroke);
        outline-offset: var(--fast-stroke-width-default);
    }

    button.active {
        background: var(--fast-background-ctrl-brand-rest);
        color: var(--fast-foreground-ctrl-on-brand-rest);
        border-color: var(--fast-stroke-divider-brand);
    }

    button.active:hover {
        background: var(--fast-background-ctrl-brand-hover);
    }
`;
