import { css } from "@microsoft/fast-element";

export const SliderLabelStyles = css`
    .sliderlabel {
        position: absolute;
        align-self: start;
        grid-row: 2;
        margin-top: -2;
        display: grid;
    }
    .sliderLabel-container {
        display: grid;
        justify-self: center;
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }
    .sliderLabel-label {
        width: 18px;
        justify-self: center;
    }
    .sliderLabel-labelPositioner {
        justify-self: center;
        width: 18px;
        margin: 2px 0;
    }
    .sliderLabel-mark {
        width: 2px;
        height: 8px;
        background: var(--neutral-outline-rest);
        justify-self: center;
    }
`;
