import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

/**
 * Styles for the {@link FASTTabPanel|FASTTabPanel component}.
 *
 * @public
 */
export const TabPanelStyles: ElementStyles = css`
    ${display("flex")} :host {
        box-sizing: border-box;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
    }
`;
