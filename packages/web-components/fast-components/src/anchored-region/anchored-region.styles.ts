import { css } from "@microsoft/fast-element";

export const AnchoredRegionStyles = css`
    :host {
        contain: layout;
        display: block;
        overflow: visible;
        height: 0px;
        width: 0px;
    }

    .region {
        position: relative;
    }
`;
