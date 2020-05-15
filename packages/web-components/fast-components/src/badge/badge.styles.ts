import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { accentForegroundRestBehavior, heightNumber } from "../styles/index.js";

export const BadgeStyles = css`
    ${display("inline-block")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-minus-1-font-size);
        line-height: var(--type-ramp-minus-1-height);
    }

    .badge {
        border-radius: calc(var(--corner-radius) * 1px);
        padding: calc(var(--design-unit) * 0.5px) calc(var(--design-unit) * 1px);
        color: var(--accent-foreground-rest);
        font-weight: 600;
    }

    .badge[style] {
        font-weight: 400;
    }

    :host(.circular) .badge {
        border-radius: 100px;
        padding: 0 calc(var(--design-unit) * 1px);
        ${
            /* Need to work with Brian on width and height here */ ""
        } height: calc((${heightNumber} - (var(--design-unit) * 3)) * 1px);
        min-width: calc((${heightNumber} - (var(--design-unit) * 3)) * 1px);
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }
`.withBehaviors(accentForegroundRestBehavior);
