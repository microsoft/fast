import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        max-width: 480px;
        margin: var(--fast-gap-between-content-x-large) auto;
        color: var(--fast-foreground-ctrl-neutral-primary-rest);
        font-family: var(--fast-text-style-default-regular-font-family);
    }

    .app {
        background: var(--fast-background-layer-primary-solid);
        border: var(--fast-stroke-width-default) solid
            var(--fast-stroke-divider-subtle);
        border-radius: var(--fast-corner-large);
        box-shadow: var(--fast-shadow-card-rest);
        padding: var(--fast-padding-content-medium);
    }

    header h1 {
        margin: 0 0 var(--fast-gap-between-content-x-small);
        font-size: var(--fast-text-global-display2-font-size);
        line-height: var(--fast-text-global-display2-line-height);
        font-weight: var(--fast-text-style-default-header-weight);
        color: var(--fast-foreground-ctrl-brand-rest);
    }

    .byline {
        margin: 0 0 var(--fast-gap-between-content-small);
        color: var(--fast-foreground-ctrl-neutral-secondary-rest);
        font-size: var(--fast-text-global-body3-font-size);
        line-height: var(--fast-text-global-body3-line-height);
    }

    code {
        background: var(--fast-background-layer-secondary);
        padding: 0 var(--fast-padding-content-xx-small);
        border-radius: var(--fast-corner-small);
        font-family: var(--fast-text-style-code-regular-font-family);
        font-size: var(--fast-text-global-caption1-font-size);
    }

    .empty {
        margin: var(--fast-gap-between-content-small) 0 0;
        color: var(--fast-foreground-ctrl-hint-default);
        font-style: italic;
        text-align: center;
        font-size: var(--fast-text-global-body3-font-size);
        line-height: var(--fast-text-global-body3-line-height);
    }
`;
