import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";

export const AnchoredRegionStyles: ElementStyles = css`
    :host {
        contain: layout;
        display: block;
    }
`;
