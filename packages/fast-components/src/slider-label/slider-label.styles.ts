import { css } from "@microsoft/fast-element";

export const SliderLabelStyles = css`
    .sliderlabel {
        position: absolute;
        align-self: start;
        grid-row: 2;
        margin-top: -2;
        display: grid;
    }
    .sliderLabel_container {
        display: grid;
        justify-self: center;
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }
    .sliderLabel_label {
        width: 18px;
        justify-self: center;
    }
    .sliderLabel_mark {
        width: 2px;
        height: 8px;
        background: #bebebe;
        justify-self: center;
    }
`;
