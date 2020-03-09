import { css } from "@microsoft/fast-element";
//import { disabledCursor, display } from "../styles";

export const SliderStyles = css`
    --thumb-size: 30px;
    :host {
        display: inline-flex;
        align-items: center;
        outline: none;
        margin: calc(var(--design-unit) * 1px) 0;
        ${
            /*
           * Chromium likes to select label text or the default slot when
           * the checkbox is clicked. Maybe there is a better solution here?
           */ ""
        } user-select: none;
    }
    .slider {
        position: relative;
        width: 400px;
        height: 30px;
        box-sizing: border-box;
        border-radius: calc(var(--corner-radius) * 1px);
        background: white;
        outline: none;
        cursor: pointer;
    }
    .background-track {
        background: red,
        border-radius: "999px"
    }
    .track {
        background: black,
        width: 100%,
        height: 4px
    }
    .thumb {
        height: var(--thumb-size),
        width: va(--thumb-size),
        border: "none",
        background: blue,
        "border-radius": "50%",
        transition: "all 0.2s ease",
        "&:hover": {
            background: red,
        },
        "&:active": {
            background: green,
        },
    }
    .label {
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        ${
            /* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast-dna/issues/2766 */ ""
        } padding-inline-start: calc(var(--design-unit) * 2px + 2px);
        margin-inline-end: calc(var(--design-unit) * 2px + 2px);
        cursor: pointer;
        ${
            /* Font size is temporary - replace when adaptive typography is figured out */ ""
        } font-size: calc(1rem + (var(--density) * 2px));
    }
    .slider:hover {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }
    :host(:focus) .slider {
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
        border-color: var(--neutral-focus);
    }
`;
