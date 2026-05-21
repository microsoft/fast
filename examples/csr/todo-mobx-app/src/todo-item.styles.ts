import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
    }

    .todo {
        display: flex;
        align-items: center;
        gap: var(--fast-gap-between-content-x-small);
        padding: var(--fast-padding-content-x-small);
        border-radius: var(--fast-corner-medium);
        border: var(--fast-stroke-width-default) solid
            var(--fast-stroke-divider-default);
        background: var(--fast-background-layer-secondary);
        transition: background var(--fast-duration-fast)
            var(--fast-curve-easy-ease);
    }

    .todo:hover {
        background: var(--fast-background-ctrl-subtle-hover);
    }

    .description {
        flex: 1;
        font-size: var(--fast-text-global-body3-font-size);
        line-height: var(--fast-text-global-body3-line-height);
    }

    .description.done {
        text-decoration: line-through;
        color: var(--fast-foreground-ctrl-hint-default);
    }

    input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
        accent-color: var(--fast-background-ctrl-brand-rest);
    }

    .remove {
        background: transparent;
        color: var(--fast-status-danger-tint-foreground);
        border: none;
        border-radius: var(--fast-corner-medium);
        padding: var(--fast-padding-content-xx-small)
            var(--fast-padding-content-xx-small);
        font-family: inherit;
        font-size: var(--fast-text-global-body3-font-size);
        line-height: var(--fast-text-global-body3-line-height);
        cursor: pointer;
        transition: background var(--fast-duration-fast)
            var(--fast-curve-easy-ease);
    }

    .remove:hover,
    .remove:active {
        background: var(--fast-status-danger-tint-background);
    }

    .remove:focus-visible {
        outline: var(--fast-ctrl-focus-outer-stroke-width) solid
            var(--fast-status-danger-tint-stroke);
        outline-offset: var(--fast-stroke-width-default);
    }
`;
