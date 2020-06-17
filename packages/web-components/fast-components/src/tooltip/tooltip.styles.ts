import { css } from "@microsoft/fast-element";

export const TooltipStyles = css`
    :host {
        contain: layout;
        overflow: visible;
        height: 0;
        width: 0;
    }

    .tooltip {
        background-color: grey;
        padding: 4px;
        display: inline-block;
        height: fit-content;
        width: fit-content;
    }
    
    :host(.top) .tooltip {
        margin-bottom: 10px;
    }

    :host(.bottom) .tooltip {
        margin-top: 10px;
    }

    :host(.left) .tooltip {
        margin-right: 10px;
    }

    :host(.right) .tooltip {
        margin-left: 10px;
    }
    
`;
