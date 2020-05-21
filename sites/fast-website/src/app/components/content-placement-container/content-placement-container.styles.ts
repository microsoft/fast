import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const ContentPlacementContainerStyles = css`
    ${display("block")}:host {
        --border: calc(var(--outline-width) * 0.5px) solid var(--neutral-outline-rest);
        contain: none;
        font-family: var(--body-font);
    }

    .framework_container,
    .community_container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-content: center;
    }

    .framework_ContentPlacement {
        padding: 0 calc(var(--design-unit) * 2px);
    }

    .framework_ContentPlacement:nth-of-type(n) {
        border: var(--border);
    }

    .framework_ContentPlacement:nth-last-of-type(1),
    .framework_ContentPlacement:nth-last-of-type(2),
    .framework_ContentPlacement:nth-last-of-type(3) {
        border-bottom: none;
    }

    .framework_ContentPlacement:nth-of-type(1),
    .framework_ContentPlacement:nth-of-type(2),
    .framework_ContentPlacement:nth-of-type(3) {
        border-top: none;
    }

    .framework_ContentPlacement:nth-of-type(3n) {
        border-right: none;
    }

    .framework_ContentPlacement:nth-of-type(3n + 1) {
        border-left: none;
    }

    @media screen and (max-width: 1000px) {
        .framework_container {
            grid-template-columns: repeat(2, 1fr);
        }

        .framework_ContentPlacement:nth-of-type(2n) {
            border: none;
            border-left: var(--border);
        }

        .framework_ContentPlacement:first-of-type,
        .framework_ContentPlacement:nth-of-type(2n + 1) {
            border: none;
            border-right: var(--border);
        }

        .framework_ContentPlacement:nth-of-type(n) {
            border-bottom: var(--border);
        }

        .framework_ContentPlacement:nth-last-of-type(1),
        .framework_ContentPlacement:nth-last-of-type(2) {
            border-bottom: none;
        }

        .framework_ContentPlacement:nth-of-type(n + 3) {
            border-top: var(--border);
        }
    }

    @media screen and (max-width: 700px) {
        .framework_container,
        .community_container {
            grid-template-columns: 1fr;
        }

        .framework_ContentPlacement:nth-of-type(n) {
            border: none;
            border-bottom: calc(var(--outline-width) * 1px) solid
                var(--neutral-outline-rest);
        }

        .framework_ContentPlacement:last-of-type {
            border: none;
        }
    }

    /* This creates the blur and background color changes on hover */
    /* start */
    .container:hover site-content-placement {
        filter: blur(1px);
    }
    .container:hover site-content-placement:hover {
        /* background: linear-gradient(349.8deg, rgba(143, 68, 95, 0.3) 20.91%, rgba(148, 81, 73, 0.3) 99.75%); */
        box-shadow: 0px 10px 44px rgba(0, 0, 0, 0.1);
        border-radius: var(--design-unit);
        filter: blur(0);
    }
    /* end */

    .icon {
        fill: currentColor;
    }

    h3 {
        margin-top: 0 0 calc(var(--design-unit) * 5px) 0;
        font-size: var(--type-ramp-plus-2-font-size);
    }
`;
