import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        padding: var(--fast-padding-content-medium);
        max-width: 480px;
        font-family: var(--fast-text-style-default-regular-font-family);
        color: var(--fast-foreground-ctrl-neutral-primary-rest);
        background: var(--fast-background-layer-primary-solid);
        border: var(--fast-stroke-width-default) solid
            var(--fast-stroke-divider-subtle);
        border-radius: var(--fast-corner-large);
        box-shadow: var(--fast-shadow-card-rest);
        margin: var(--fast-gap-between-content-x-large) auto;
    }

    .toolbar {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--fast-gap-between-content-x-small);
    }

    h1 {
        margin: 0 0 var(--fast-gap-between-content-small);
        font-size: var(--fast-text-global-display2-font-size);
        line-height: var(--fast-text-global-display2-line-height);
        font-weight: var(--fast-text-style-default-header-weight);
        color: var(--fast-foreground-ctrl-brand-rest);
    }

    .theme-toggle {
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

    .theme-toggle:hover {
        background: var(--fast-background-ctrl-brand-hover);
    }

    .theme-toggle:active {
        background: var(--fast-background-ctrl-brand-pressed);
    }

    .theme-toggle:focus-visible {
        outline: var(--fast-ctrl-focus-outer-stroke-width) solid
            var(--fast-ctrl-focus-outer-stroke);
        outline-offset: var(--fast-stroke-width-default);
    }

    section {
        display: flex;
        align-items: center;
        gap: var(--fast-gap-between-content-x-small);
        margin-top: var(--fast-gap-between-content-small);
        font-size: var(--fast-text-global-body3-font-size);
        line-height: var(--fast-text-global-body3-line-height);
        color: var(--fast-foreground-ctrl-neutral-secondary-rest);
    }

    select {
        background: var(--fast-background-layer-primary-solid);
        color: var(--fast-foreground-ctrl-neutral-primary-rest);
        border: var(--fast-stroke-width-default) solid
            var(--fast-stroke-ctrl-on-outline-rest);
        border-radius: var(--fast-corner-small);
        padding: var(--fast-padding-content-xx-small)
            var(--fast-padding-content-x-small);
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    select:focus-visible {
        outline: var(--fast-ctrl-focus-outer-stroke-width) solid
            var(--fast-ctrl-focus-outer-stroke);
        outline-offset: var(--fast-stroke-width-default);
    }

    .todo-list {
        list-style-type: none;
        padding: 0;
        margin: var(--fast-gap-between-content-small) 0 0;
    }

    .todo {
        margin: var(--fast-gap-between-content-x-small) 0;
        padding: var(--fast-padding-content-x-small);
        display: flex;
        align-items: center;
        gap: var(--fast-gap-between-content-x-small);
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
        display: inline-block;
        align-self: center;
        margin: 0;
        flex: 1;
        font-size: var(--fast-text-global-body3-font-size);
        line-height: var(--fast-text-global-body3-line-height);
    }

    .description.done {
        text-decoration: line-through;
        color: var(--fast-foreground-ctrl-hint-default);
    }

    .todo button {
        color: var(--fast-status-danger-tint-foreground);
        background: transparent;
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

    .todo button:hover,
    .todo button:active {
        background: var(--fast-status-danger-tint-background);
    }

    .todo button:focus-visible {
        outline: var(--fast-ctrl-focus-outer-stroke-width) solid
            var(--fast-status-danger-tint-stroke);
        outline-offset: var(--fast-stroke-width-default);
    }
`;
