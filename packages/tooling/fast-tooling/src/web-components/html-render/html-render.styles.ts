import { css } from "@microsoft/fast-element";

export const HTMLRenderStyles = css`
    .container {
        width:100%;
        height:100%;
        padding:40px;
        box-sizing:border-box;
    }
    .htmlRender {
        width:100%;
        height:100%;
        background-color: white;
        outline:none;
    }
    #overlayContainer {
        position:absolute;
        top:0;
        right:0;
        bottom:0;
        left:0;
        pointer-events: none;
    }
    #clickDisplay,
    #hoverDisplay {
        display:none;
        position: absolute;
        box-sizing: content-box;
        top:0;
        left:0;
        width:0;
        height:0;
        pointer-events: none;
        margin:-2px 0 0 -2px;
    }
    #hoverDisplay.active {
        display:block;
        border: 2px solid rgba(251,53,109,0.16);
        background-color: rgba(251,53,109,0.16);
    }
    #clickDisplay.active {
        display:block;
        border: 2px solid #fb356d;
    }
    .pill {
        position:absolute;
        box-sizing:border-box;
        top:-22px;
        line-height:14px;
        border-radius: 8px;
        background-color: #fb356d;
        padding: 0 6px;
        border:2px solid #fb356d;
        font-size: 12px;
        text-transform:uppercase;
        font-weight: 700;
        font-family:Arial;
    }
    #hoverDisplay .pill {
        background-color: #fff;
    }

    div.foo {
        border: 1px solid black;
        padding: 15px;
    }
`;