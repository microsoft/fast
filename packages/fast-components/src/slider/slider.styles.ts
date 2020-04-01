import { css } from "@microsoft/fast-element";
import { disabledCursor, display } from "../styles";
import { focusVisible } from "../styles/focus";
import { SystemColors } from "../styles/system-colors";

export const SliderStyles = css`
    :host {
        --thumb-size: calc(var(--height-number) * 0.5);
        --thumb-translate: calc(var(--thumb-size) * 0.5);
        --track-overhang: calc((var(--design-unit) / 2) * -1);
    }
    :host([hidden]) {
        display: none;
    }

    ${display("inline-grid")} :host {
        align-items: center;
        outline: none;
        width: 100%;
        margin: calc(var(--design-unit) * 1px) 0;
        ${
            /*
           * Chromium likes to select label text or the default slot when
           * the checkbox is clicked. Maybe there is a better solution here?
           */ ""
        } user-select: none;
    }
    .slider {
        box-sizing: border-box;
        border-radius: calc(var(--corner-radius) * 1px);
        outline: none;
        cursor: pointer;
    }
    .foreground-track {
        display: none;
        background: var(--neutral-foreground-hint);
        transition: all 0.2s ease;
    }
    .layout-region {
        position: relative;
        margin: 0 8px;
        display: grid;
        grid-template-rows: calc(var(--thumb-size) * 1px) 1fr;
    }
    .thumb-container {
        position: absolute;
        height: calc(var(--thumb-size) * 1px);
        width: calc(var(--thumb-size) * 1px);
        transition: "all 0.2s ease";
    }
    .thumb-cursor {
        border: none;
        width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
        background: var(--neutral-foreground-rest);
        border-radius: 50%;
    }
    .thumb-cursor:hover {
        background: var(--neutral-foreground-hover);
        border-color: var(--neutral-outline-hover);
    }
    .thumb-cursor:active {
        background: var(--neutral-foreground-active);
    }
    .slider-horizontal .thumb-container {
        transform: translateX(calc(var(--thumb-translate) * 1px));
    }
    .slider-vertical .thumb-container {
        transform: translateY(calc(var(--thumb-translate) * 1px));
    }
    .slider-horizontal {
        width: 100%;
    }
    .slider-horizontal .track {
        right: calc(var(--track-overhang) * 1px);
        left: calc(var(--track-overhang) * 1px);
        align-self: start;
        margin-top: 6px;
        height: 4px;
    }
    .slider-vertical .track {
        top: calc(var(--track-overhang) * 1px);
        bottom: calc(var(--track-overhang) * 1px);
        justify-self: start;
        margin-left: 6px;
        width: 4px;
    }
    .track {
        background: var(--neutral-outline-rest);
        position: absolute;
    }
    .slider-vertical {
        height: 100%;
    }
    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .slider,
    :host(.disabled) .slider {
        cursor: ${disabledCursor};
    }
    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }

    @media (forced-colors: active) {
        .thumb-cursor, .thumb-cursor:hover, .thumb-cursor:active {
            forced-color-adjust: none;
            border-color: ${SystemColors.FieldText};
            background: ${SystemColors.FieldText};
        }

        .track {
            forced-color-adjust: none;
            background: ${SystemColors.FieldText};
        }

        .foreground-track {
            forced-color-adjust: none;
            background: ${SystemColors.ActiveText}
        }
        
        :host(:${focusVisible}) .thumb-cursor {
            border-color: ${SystemColors.Highlight};
        }

        :host(.disabled) {
            opacity: 1;
        }

        :host(.disabled) .slider .track .thumb-cursor {
            forced-color-adjust: none;
            background: ${SystemColors.GrayText};
        }
    }
`;
