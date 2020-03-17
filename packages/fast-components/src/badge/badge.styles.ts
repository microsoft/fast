import { css } from "@microsoft/fast-element";
import { display } from "../styles";

export const BadgeStyles = css`
    ${display("inline-block")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
    }

    .badge {
        border-radius: calc(var(--elevated-corner-radius) * 1px);
        padding: calc(var(--design-unit) * 1.5px);
        ${/* Font size, weight, and line height are temporary - 
            replace when adaptive typography is figured out */ ""} font-size: 12px;
        font-weight: 400px;
        line-height: 18px;
    }

    :host(.circular) .badge {
        border-radius: 100px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        box-sizing: border-box;
    }

    :host(.small) .badge {
        padding: calc(var(--design-unit) * 1px);
        ${/* Font size, weight, and line height are temporary - 
            replace when adaptive typography is figured out */ ""} font-size: 10px;
        font-weight: 400px;
        line-height: 16px;
    }

    :host(.circular.small) .badge {
        ${/* Need to work with Brian on width and height here */ ""} height: 20px;
        min-width: 20px;
        padding: 0 calc(var(--design-unit) * 1px);
    }

    :host(.medium)) .badge {
        padding: calc(var(--design-unit) * 1.5px);
        ${/* Font size, weight, and line height are temporary - 
            replace when adaptive typography is figured out */ ""} font-size: 12px;
        font-weight: 400px;
        line-height: 18px;
    }

    :host(.circular.medium) .badge {
        ${/* Need to work with Brian on width and height here */ ""} height: 26px;
        min-width: 26px;
        padding: 0 calc(var(--design-unit) * 1px);
    }

    :host(.large) .badge {
        padding: calc(var(--design-unit) * 2px);
        ${/* Font size, weight, and line height are temporary - 
            replace when adaptive typography is figured out */ ""} font-size: 14px;
        font-weight: 400px;
        line-height: 20px;
    }

    :host(.circular.large) .badge {
        ${/* Need to work with Brian on width and height here */ ""} height: calc(var(--height-number) * 1px);
        min-width: calc(var(--height-number) * 1px);
        padding: 0 calc(var(--horizontal-spacing) * 1px);
    }
`;
