import { css } from "@microsoft/fast-element";

export const DesignSystemProviderStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: block;
        --neutral-foreground-rest: #2b2b2b;
        --neutral-foreground-hover: #2b2b2b;
        --neutral-foreground-active: #2b2b2b;
        --neutral-foreground-focus: #2b2b2b;

        --neutral-foreground-toggle: #ffffff;
        --neutral-foreground-toggle-large: #ffffff;

        --neutral-foreground-hint: #767676;
        --neutral-foreground-hint-large: #929292;

        --accent-foreground-rest: #0078d4;
        --accent-foreground-hover: #0066b4;
        --accent-foreground-active: #1181d7;
        --accent-foreground-focus: #0078d4;

        --accent-foreground-cut-rest: #ffffff;

        --accent-foreground-large-rest: #0078d4;
        --accent-foreground-large-hover: #0066b4;
        --accent-foreground-large-active: #1181d7;
        --accent-foreground-large-focus: #0078d4;

        --neutral-fill-rest: #ededed;
        --neutral-fill-hover: #e5e5e5;
        --neutral-fill-active: #f2f2f2;
        --neutral-fill-focus: #ffffff;
        --neutral-fill-selected: #ededed;

        --neutral-fill-stealth-rest: #ffffff;
        --neutral-fill-stealth-hover: #f2f2f2;
        --neutral-fill-stealth-active: #f7f7f7;
        --neutral-fill-stealth-focus: #ffffff;
        --neutral-fill-stealth-selected: #ededed;

        --neutral-fill-toggle-rest: #767676;
        --neutral-fill-toggle-hover: #616161;
        --neutral-fill-toggle-active: #838383;
        --neutral-fill-toggle-focus: #767676;

        --neutral-fill-input-rest: #ffffff;
        --neutral-fill-input-hover: #ffffff;
        --neutral-fill-input-active: #ffffff;
        --neutral-fill-input-focus: #ffffff;

        --accent-fill-rest: #0078d4;
        --accent-fill-hover: #006cbe;
        --accent-fill-active: #1683d8;
        --accent-fill-focus: #0078d4;
        --accent-fill-selected: #005393;

        --accent-fill-large-rest: #0078d4;
        --accent-fill-large-hover: #006cbe;
        --accent-fill-large-active: #1683d8;
        --accent-fill-large-focus: #0078d4;
        --accent-fill-large-selected: #005393;

        --neutral-fill-card-rest: #f7f7f7;

        --neutral-outline-rest: #bebebe;
        --neutral-outline-hover: #979797;
        --neutral-outline-active: #d6d6d6;
        --neutral-outline-focus: #bebebe;

        --neutral-divider-rest: #eaeaea;

        --neutral-layer-floating: #ffffff;
        --neutral-layer-card: #ffffff;
        --neutral-layer-card-container: #f7f7f7;
        --neutral-layer-l1: #ffffff;
        --neutral-layer-l1-alt: #f7f7f7;
        --neutral-layer-l2: #e5e5e5;
        --neutral-layer-l3: #dddddd;
        --neutral-layer-l4: #d6d6d6;

        --neutral-focus: #888888;

        --neutral-focus-inner-accent: #ffffff;
    }
`;
