import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

/**
 * Styles for the {@link @microsoft/fast-components#FASTBreadcrumb|FASTBreadcrumb} component.
 *
 * @public
 */
export const BreadcrumbStyles: ElementStyles = css`
    ${display("inline-block")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    .list {
        display: flex;
    }
`;
