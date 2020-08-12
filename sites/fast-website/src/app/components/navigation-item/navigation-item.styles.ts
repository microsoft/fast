import { neutralForegroundRestBehavior } from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const NavigationItemStyles = css`
    ${display("inline-flex")} :host {
        margin: 0 30px;
        padding: 0;
    }

    fast-anchor {
        background: transparent;
        color: currentColor;
        font-size: inherit;
    }

    fast-anchor:focus-within,
    fast-anchor:hover {
        color: var(--neutral-foreground-rest);
    }

    fast-anchor:not(:focus):hover::part(content)::before {
        display: none;
    }

    fast-anchor:focus::part(content)::before {
        background-color: currentColor;
    }
`.withBehaviors(neutralForegroundRestBehavior);
