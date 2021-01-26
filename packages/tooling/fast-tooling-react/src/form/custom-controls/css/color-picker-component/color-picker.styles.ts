import { css } from "@microsoft/fast-element";

export const ColorPickerStyles = css`

    .root .colorUI
    {
        display:none;
        padding: 5px;
        flex-direction:row;
        background-color: var(--neutral-layer-floating);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
    }

    .root.open .colorUI
    {
        display:flex;
        position:absolute;
        z-index:1;
        margin-left:-30px;
    }

    .pickerContainer
    {
        margin-right:5px;
    }

    .inputContainer
    {
        width: 65px;
    }

    .satLightPicker
    {
        position:relative;
        width: 200px;
        height: 200px;
        margin-bottom: 5px;
        background: -moz-linear-gradient(bottom, #000 0%, rgba(0, 0, 0, 0) 100%), -moz-linear-gradient(left, #FFF 0%, rgba(255, 255, 255, 0) 100%);
        background: -webkit-linear-gradient(bottom, #000 0%, rgba(0, 0, 0, 0) 100%), -webkit-linear-gradient(left, #FFF 0%, rgba(255, 255, 255, 0) 100%);
        background: -ms-linear-gradient(bottom, #000 0%, rgba(0, 0, 0, 0) 100%), -ms-linear-gradient(left, #FFF 0%, rgba(255, 255, 255, 0) 100%);
        background: -o-linear-gradient(bottom, #000 0%, rgba(0, 0, 0, 0) 100%), -o-linear-gradient(left, #FFF 0%, rgba(255, 255, 255, 0) 100%);        
        background-color: #F00;
        border: 1px solid #fff;
    }

    .satLightLocation
    {
        position: absolute;
        top: 0;
        left: 0;
        border: 1px solid #fff;
        border-radius:3px;
        width:4px;
        height:4px;
        pointer-events:none;
    }

    .huePicker
    {
        position:relative;
        width:200px;
        height:30px;
        margin-bottom: 5px;
        background: -moz-linear-gradient(left, #F00 0%, #FF0 16.66%, #0F0 33.33%, #0FF 50%, #00F 66.66%, #F0F 83.33%, #F00 100%);
        background: -webkit-linear-gradient(left, #F00 0%, #FF0 16.66%, #0F0 33.33%, #0FF 50%, #00F 66.66%, #F0F 83.33%, #F00 100%);
        background: -ms-linear-gradient(left, #F00 0%, #FF0 16.66%, #0F0 33.33%, #0FF 50%, #00F 66.66%, #F0F 83.33%, #F00 100%);
        background: -o-linear-gradient(left, #F00 0%, #FF0 16.66%, #0F0 33.33%, #0FF 50%, #00F 66.66%, #F0F 83.33%, #F00 100%);
    }

    .hueLocation,
    .alphaLocation
    {
        position:absolute;
        left:0;
        top:-2px;
        border: 1px solid #fff;
        width:1px;
        height:32px;
        pointer-events:none;
    }

    .alphaPicker
    {
        position: relative;
        width:200px;
        height:30px;
        background-image: linear-gradient(45deg, #999 25%, transparent 25%), linear-gradient(-45deg, #999 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #999 75%), linear-gradient(-45deg, transparent 75%, #999 75%);
        background-size: 20px 20px;
        background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        background-color: #fff;
    }

    .alphaMask
    {
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to right, transparent, #F00);
        margin-bottom: 5px;
    }

    .selectedColor 
    {
        position: relative;
        display: inline-block;
        width: 25px;
        height: 25px;
        margin-top: auto;
        margin-bottom: auto;
        border: 1px solid var(--fast-tooling-l1-color, #333333);
    }

    .selectedColor::before
    {
        position: absolute;
        content: "";
        left:0;
        right:0;
        top:0;
        bottom:0;
        background-image: linear-gradient(to bottom left,  transparent calc(50% - 1px), var(--fast-tooling-l1-color, #333333), transparent calc(50% + 1px)); 
    }

    .selectedColor::after
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
