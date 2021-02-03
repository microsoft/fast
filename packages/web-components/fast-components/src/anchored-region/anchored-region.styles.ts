import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";

/**
 * Styles for the {@link @microsoft/fast-components#FASTAnchoredRegion|FASTAnchoredRegion} component.
 *
 * @public
 */
export const AnchoredRegionStyles: ElementStyles = css`
    :host {
        contain: layout;
        display: block;
    }
`;
