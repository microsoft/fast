import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Styles for Welcome
 * @public
 */
export const welcomeStyles: ElementStyles = css`
    :host {
        --accent-color: #da1a5f;
        --fill-color: #ffffff;
        --font-color: #000000;
        --background: #efefef;
        --links-font-color: #000000;
        --body-font: aktiv-grotesk, "Segoe UI", Arial, Helvetica, sans-serif;
        --type-ramp-plus-6-font-size: 60px;
        --type-ramp-plus-6-line-height: 72px;
        --type-ramp-plus-5-font-size: 46px;
        --type-ramp-plus-5-line-height: 56px;
        --type-ramp-plus-4-font-size: 34px;
        --type-ramp-plus-4-line-height: 44px;
        --type-ramp-plus-3-font-size: 28px;
        --type-ramp-plus-3-line-height: 36px;
        --type-ramp-plus-2-font-size: 20px;
        --type-ramp-plus-2-line-height: 28px;
        --type-ramp-plus-1-font-size: 16px;
        --type-ramp-plus-1-line-height: 24px;
        --type-ramp-base-font-size: 14px;
        --type-ramp-base-line-height: 20px;
        --control-corner-radius: 4;
        --neutral-fill-rest: #e3e3e3;
    }

    .dark {
        --fill-color: #424242;
        --font-color: #e5e5e5;
        --background: #181818;
        --links-font-color: #ffffff;
        --neutral-fill-rest: #2b2b2b;
    }

    :host > div {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        row-gap: 48px;
        text-align: center;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        min-height: 100vh;
        color: var(--font-color);
        background: var(--background);
    }

    h1 {
        display: flex;
        column-gap: 18px;
        flex-wrap: wrap;
        justify-content: center;
        font-size: var(--type-ramp-plus-6-font-size);
        line-height: var(--type-ramp-plus-6-line-height);
        margin: 70px 0;
    }

    h1 span {
        display: flex;
        align-items: center;
    }

    h2 {
        font-size: var(--type-ramp-plus-4-font-size);
        line-height: var(--type-ramp-plus-4-line-height);
    }

    h3 {
        font-size: var(--type-ramp-plus-2-font-size);
        line-height: var(--type-ramp-plus-2-line-height);
    }

    h4 {
        font-size: var(--type-ramp-plus-1-font-size);
        line-height: var(--type-ramp-plus-1-line-height);
    }

    header,
    main,
    footer {
        padding: 0 12px;
    }

    header {
        display: flex;
        flex-direction: column;
    }

    header p {
        max-width: 900px;
        align-self: center;
        font-size: var(--type-ramp-plus-2-font-size);
        line-height: var(--type-ramp-plus-2-line-height);
    }

    header svg {
        display: inline-block;
        width: 90px;
        height: 80px;
        margin-inline-end: 10px;
        shape-rendering: geometricPrecision;
    }

    header .icon-brand-fast,
    .card svg {
        fill: var(--font-color);
    }

    .card-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        column-gap: 24px;
        row-gap: 24px;
    }

    .card {
        width: 320px;
        border-radius: calc(var(--control-corner-radius) * 1px);
        background: var(--fill-color);
        text-align: left;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
    }

    .card .image {
        background: var(--neutral-fill-rest);
        padding: 44px 0;
    }

    .card .image svg {
        width: 320px;
        height: 80px;
    }

    .card .image.small {
        padding: 54px 0;
    }

    .card .image.small svg {
        height: 60px;
    }

    .card .content {
        padding: 10px 15px;
        flex-grow: 1;
    }

    .card .action {
        padding: 10px 15px;
    }

    .card .action svg {
        margin-left: 2px;
        position: relative;
        top: 1px;
    }

    .card a {
        display: inline-block;
        background: var(--accent-color);
        border-radius: calc(var(--control-corner-radius) * 1px);
        text-decoration: none;
        padding: 10px;
        color: #ffffff;
    }

    footer {
        padding: 20px;
    }

    a {
        color: var(--links-font-color);
    }
`;
