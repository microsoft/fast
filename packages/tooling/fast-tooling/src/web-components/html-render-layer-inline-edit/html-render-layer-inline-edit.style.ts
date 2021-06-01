import { css } from "@microsoft/fast-element";

export const HTMLRenderLayerInlineEditStyles = css`
    .edit-region {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
    }

    .text-area
    {
        display: none;
        position: absolute;
        box-sizing: content-box;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        pointer-events: auto;
        margin:0;
        border:none;
        padding:0;
        background: transparent;
        color: rgba(0,0,0,0);
        caret-color: black;
    }

    .text-area.active
    {
        display:block;
    }
`;