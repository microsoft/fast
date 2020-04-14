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
    }

    .start {
    }

    .end {
    }

    .activeIndicator {
        position: absolute;
        bottom: 0;
        width: 40px;
        left: -20px;
        height: 3px;
        border-radius: 5px;
        background: blue;
        transition: 0.2s ease-in-out;
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
        display: flex;
        flex-direction: column;
        position: relative;
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
        position: absolute;
        left: 0;
        width: 3px;
        top: -5px;
        height: 10px;
        border-radius: 5px;
        background: blue;
        transition: 0.2s ease-in-out;
    }
`;
