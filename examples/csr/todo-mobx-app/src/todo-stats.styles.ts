import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        margin-top: var(--fast-gap-between-content-small);
        padding-top: var(--fast-padding-content-small);
        border-top: var(--fast-stroke-width-default) solid
            var(--fast-stroke-divider-default);
    }

    .stats {
        display: flex;
        align-items: center;
        gap: var(--fast-gap-between-content-x-small);
        color: var(--fast-foreground-ctrl-neutral-secondary-rest);
        font-size: var(--fast-text-global-body3-font-size);
        line-height: var(--fast-text-global-body3-line-height);
    }

    .count {
        flex: 1;
    }

    button {
        background: transparent;
        color: var(--fast-foreground-ctrl-neutral-secondary-rest);
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

    .clear-completed {
        color: var(--fast-status-danger-tint-foreground);
        border-color: var(--fast-status-danger-tint-stroke);
    }

    .clear-completed:hover,
    .clear-completed:active {
        background: var(--fast-status-danger-tint-background);
    }

    .clear-completed:focus-visible {
        outline-color: var(--fast-status-danger-tint-stroke);
    }
`;
