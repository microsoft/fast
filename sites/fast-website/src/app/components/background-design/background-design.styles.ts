import { neutralFillRestBehavior } from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const BackgroundDesignStyles = css`
    ${display("block")} :host {
        contain: content;
        height: 99vh; /* https://developers.google.com/web/updates/2016/12/url-bar-resizing */
        isolation: isolate;
        position: fixed;
        z-index: 0;
        left: 0;
        top: 0;
        width: 100%;
    }

    :host .background-image {
        align-items: center;
        display: flex;
        height: 100%;
        justify-content: center;
        position: relative;
        width: 100%;
    }

    :host .background-image::after {
        background: var(--background-color);
        content: "";
        display: block;
        height: 100%;
        left: 0;
        opacity: 0.45;
        position: absolute;
        top: 0;
        width: 100%;
        transition: opacity 450ms ease-in-out;
    }

    :host .background-image.is-faded::after {
        opacity: 0.75;
    }

    :host .background-image canvas {
        height: auto;
        min-width: 1440px;
        object-fit: cover;
        object-position: 50% 50%;
        width: 100%;
    }
`.withBehaviors(neutralFillRestBehavior);
