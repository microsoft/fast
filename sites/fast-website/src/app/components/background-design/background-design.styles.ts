import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { neutralFillRestBehavior } from "@microsoft/fast-components";

export const BackgroundDesignStyles = css`
    ${display("block")} :host {
        contain: content;
        filter: blur(calc(var(--blur-amount) * 65px));
        height: 99vh; /* https://developers.google.com/web/updates/2016/12/url-bar-resizing */
        isolation: isolate;
        position: fixed;
        pointer-events: none;
        z-index: 0;
    }

    :host,
    :host::after {
        left: 0;
        top: 0;
    }

    :host,
    :host::after,
    :host svg {
        width: 100%;
    }

    :host::after,
    :host svg {
        height: 100%;
    }

    :host svg {
        fill: none;
        object-position: 50% 50%;
    }

    :host::after {
        background: linear-gradient(var(--neutral-fill-rest) 90%, transparent);
        content: "";
        display: block;
        opacity: 0.45;
        position: absolute;
    }
`.withBehaviors(neutralFillRestBehavior);
