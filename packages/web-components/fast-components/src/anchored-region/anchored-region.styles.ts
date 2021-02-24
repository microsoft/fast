import { css } from "@microsoft/fast-element";

export const AnchoredRegionStyles = css`
    :host {
        contain: layout;
        display: block;
        pointer-events: "none";
    }

    :host(.loading) {
        pointer-events: "none";
        opacity: 0;
    }
`;
