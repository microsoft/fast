import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-components";

export const ContentPlacementContainerStyles = css`
    :host {
        contain: content;
        font-family: var(--body-font);
    }
    :host([hidden]) {
        display: none;
    }
    .container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    /* This creates the blur and background color changes on hover */
    /* start */
    .container:hover site-content-placement {
        filter: blur(2px);
    }
    .container:hover site-content-placement:hover {
        /* background: linear-gradient(349.8deg, rgba(143, 68, 95, 0.3) 20.91%, rgba(148, 81, 73, 0.3) 99.75%); */
        box-shadow: 0px 10px 44px rgba(0, 0, 0, 0.1);
        border-radius: var(--design-unit);
        filter: blur(0);
    }
    /* end */
`;