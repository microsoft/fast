import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const BreadcrumbItemStyles = css`
    ${display("inline-block")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-minus-1-font-size);
        line-height: var(--type-ramp-minus-1-height);
    }

    .content {
        display: flex;
        align-items: center;
    }

    .separator {
        margin: 0 6px;
    }

    .separator.hide {
        display: none;
    }
`;
