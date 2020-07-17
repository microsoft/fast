import { css } from "@microsoft/fast-element";
import {
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    accentForegroundRestBehavior,
    heightNumber,
    neutralFillActiveBehavior,
    neutralFillHoverBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundActiveBehavior,
    neutralForegroundHintBehavior,
    neutralForegroundHoverBehavior,
    neutralForegroundRestBehavior,
} from "../../styles/index";

export const CarouselSlideStyles = css`
    ${display("inline-flex")} :host {    ${display("flex")} :host {
        box-sizing: border-box;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
    }`;
