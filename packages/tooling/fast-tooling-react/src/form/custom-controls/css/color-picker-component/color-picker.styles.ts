import { css } from "@microsoft/fast-element";

export const ColorPickerStyles = css`
    .root .selectedColor {
        position: relative;
        display: inline-block;
        width: 25px;
        height: 25px;
        margin-top: auto;
        margin-bottom: auto;
        border: 1px solid var(--fast-tooling-l1-color, #333333);
    }

    .root .selectedColor::before
    {
        position: absolute;
        content: "";
        left:0;
        right:0;
        top:0;
        bottom:0;
        background-image: linear-gradient(to bottom left,  transparent calc(50% - 1px), var(--fast-tooling-l1-color, #333333), transparent calc(50% + 1px)); 
    }

    .root .selectedColor::after
    {
        position: absolute;
        content: "";
        left:0;
        right:0;
        top:0;
        bottom:0;
        background-color: var(--selectedColor-value);
    }
`;
