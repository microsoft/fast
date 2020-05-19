import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const ContentPlacementContainerStyles = css`
    ${display("block")}:host {
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

    .framework_ContentPlacement4,
    .framework_ContentPlacement5,
    .framework_ContentPlacement6 {
        border-top: calc(var(--outline-width) * 0.5px) solid var(--neutral-outline-rest);
    }

    .framework_ContentPlacement1,
    .framework_ContentPlacement2,
    .framework_ContentPlacement4,
    .framework_ContentPlacement5 {
        border-right: calc(var(--outline-width) * 0.5px) solid var(--neutral-outline-rest);
    }

    .framework_ContentPlacement1,
    .framework_ContentPlacement2,
    .framework_ContentPlacement3 {
        border-bottom: calc(var(--outline-width) * 0.5px) solid
            var(--neutral-outline-rest);
    }

    .framework_ContentPlacement2,
    .framework_ContentPlacement3,
    .framework_ContentPlacement5,
    .framework_ContentPlacement6 {
        border-left: calc(var(--outline-width) * 0.5px) solid var(--neutral-outline-rest);
    }

    @media screen and (max-width: 1000px) {
        .framework_container {
            grid-template-columns: repeat(2, 1fr);
        }

        .framework_ContentPlacement {
            border: none;
        }

        .framework_ContentPlacement2,
        .framework_ContentPlacement4,
        .framework_ContentPlacement6 {
            border-left: calc(var(--outline-width) * 0.5px) solid
                var(--neutral-outline-rest);
        }

        .framework_ContentPlacement1,
        .framework_ContentPlacement3,
        .framework_ContentPlacement5 {
            border-right: calc(var(--outline-width) * 0.5px) solid
                var(--neutral-outline-rest);
        }

        .framework_ContentPlacement1,
        .framework_ContentPlacement2,
        .framework_ContentPlacement3,
        .framework_ContentPlacement4 {
            border-bottom: calc(var(--outline-width) * 0.5px) solid
                var(--neutral-outline-rest);
        }

        .framework_ContentPlacement3,
        .framework_ContentPlacement4,
        .framework_ContentPlacement5,
        .framework_ContentPlacement6 {
            border-top: calc(var(--outline-width) * 0.5px) solid
                var(--neutral-outline-rest);
        }
    }

    @media screen and (max-width: 700px) {
        .framework_container,
        .community_container {
            grid-template-columns: 1fr;
        }

        .framework_ContentPlacement {
            border: none;
        }

        .framework_ContentPlacement1,
        .framework_ContentPlacement2,
        .framework_ContentPlacement3,
        .framework_ContentPlacement4,
        .framework_ContentPlacement5 {
            border-bottom: calc(var(--outline-width) * 1px) solid
                var(--neutral-outline-rest);
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
        margin-top: 0;
        margin-bottom: calc(var(--design-unit) * 5px);
        font-size: var(--type-ramp-plus-2-font-size);
    }
`;
