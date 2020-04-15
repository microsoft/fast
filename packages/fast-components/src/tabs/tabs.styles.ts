import { css } from "@microsoft/fast-element";
import { display } from "../styles";
import { heightNumber } from "../styles/size";

export const TabsStyles = css`
    ${display("grid")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        ${/* Font size, weight, and line height are temporary - 
            replace when adaptive typography is figured out */ ""} font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto 1fr;
    }

    .tablist {
        display: grid;
        grid-template-rows: auto auto;
        grid-template-columns: auto;
        position: relative;
        width: max-content;
    }

    .start {
    }

    .end {
    }

    .activeIndicator {
        grid-row: 2;
        grid-column: 1;
        width: 40px;
        height: 3px;
        border-radius: 5px;
        justify-self: center;
        background: blue;
    }

    .activeIndicatorTransition {
        transition: transform 0.2s linear;
    }

    .tabpanel {
        grid-row: 2;
        grid-column-start: 1;
        grid-column-end: 3;
    }

    :host(.vertical) {
        grid-template-rows: auto 1fr auto;
        grid-template-columns: auto 1fr;
    }

    :host(.vertical) .tablist {
        grid-row-start: 2;
        grid-row-end: 2;
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: auto auto;
        position: relative;
        width: max-content;
    }

    :host(.vertical) .tabpanel {
        grid-column: 2;
        grid-row-start: 1;
        grid-row-end: 3;
    }

    :host(.vertical) .end {
        grid-row: 3;
    }

    :host(.vertical) .activeIndicator {
        grid-column: 1;
        grid-row: 1;
        width: 3px;
        height: 10px;
        border-radius: 5px;
        align-self: center;
        background: blue;
    }

    :host(.vertical) .activeIndicatorTransition {
        transition: transform 0.2s linear;
    }
`;
