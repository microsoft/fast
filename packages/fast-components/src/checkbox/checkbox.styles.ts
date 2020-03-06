import { css } from "@microsoft/fast-element";
import { disabled, display } from "../styles";

export const CheckboxStyles = css`
    ${display("inline-flex")} :host {
        align-items: center;
        outline: none;
        margin: calc(var(--design-unit) * 1px) 0;
        ${/*
           * Chromium likes to select label text or the default slot when
           * the checkbox is clicked. Maybe there is a better solution here?
           */ ""} user-select: none;
    }

    .checkbox {
        position: relative;
        width: calc((var(--height-number) / 2 + var(--design-unit)) * 1px);
        height: calc((var(--height-number) / 2 + var(--design-unit)) * 1px);
        box-sizing: border-box;
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        background: var(--neutral-fill-input-rest);
        outline: none;
        cursor: pointer;
    }

    :host(.disabled) .checkbox,
    :host(.readonly) .checkbox {
        cursor: not-allowed;
    }

    .checkbox:hover {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }

    .checkbox:focus {
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
        border-color: var(--neutral-focus);
    }

    .label {
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        ${/* Need to discuss with Brian how HorizontalSpacingNumber can work */ ""} padding-inline-start: calc(var(--design-unit) * 2px + 2px);
        margin-inline-end: calc(var(--design-unit) * 2px + 2px);
        cursor: pointer;
        ${/* Font size is temporary - replace when adaptive typography is figured out */ ""} font-size: calc(1rem + (var(--density) * 2px));
    }

    :host(.disabled) .label,
    :host(.readonly) .label {
        cursor: not-allowed;
    }

    .checked-indicator {
        width: 100%;
        height: 100%;
        display: block;
        fill: var(--neutral-foreground-rest);
        opacity: 0;
        pointer-events: none;
    }

    .indeterminate-indicator {
        border-radius: calc(var(--corner-radius) * 1px);
        background: var(--neutral-foreground-rest);
        position: absolute;
        top: 25%;
        right: 25%;
        bottom: 25%;
        left: 25%;
        opacity: 0;
    }

    :host(.checked:not(.indeterminate)) .checked-indicator,
    :host(.indeterminate) .indeterminate-indicator {
        opacity: 1;
    }

    :host(.disabled) {
        ${disabled};
    }
`;
