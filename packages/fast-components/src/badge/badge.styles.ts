import { css } from "@microsoft/fast-element";
import { display } from "../styles";

export const BadgeStyles = css`
    ${display("inline-block")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        ${/* Font size, weight, and line height are temporary - 
            replace when adaptive typography is figured out */ ""} font-size: 12px;
        font-weight: 400px;
        line-height: 18px;
    }

    .badge {
        border-radius: calc(var(--corner-radius) * 1px);
        padding: calc(var(--design-unit) * 0.5px) calc(var(--design-unit) * 1px);
    }

    :host(.circular) .badge {
        border-radius: 100px;
        padding: 0 calc(var(--design-unit) * 1px);
        ${/* Need to work with Brian on width and height here */ ""} height: calc((var(--height-number) - (var(--design-unit) * 3)) * 1px);
        min-width: calc((var(--height-number) - (var(--design-unit) * 3)) * 1px);
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }
`;
