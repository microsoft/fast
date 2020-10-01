import { css, elements, html, slotted } from "@microsoft/fast-element";
import { focusVisible } from "@microsoft/fast-foundation";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    heightNumber,
    neutralFillHoverBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundHintBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineRestBehavior,
} from "../styles/index";
import { FastInput } from "./index";

export const rangeInputStyles = css`
    ::slotted(input) {
        -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
        width: 100%; /* Specific width is required for Firefox. */
        background: transparent; /* Otherwise white in Chrome */
    }

    ::slotted(input[type="range"])::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: blue !important;
    }

    ::slotted(input):focus {
        outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
    }

    ::slotted(input)::-ms-track {
        width: 100%;
        cursor: pointer;

        /* Hides the slider so custom styles can be added */
        background: transparent;
        border-color: transparent;
        color: transparent;
    }

    ::slotted(label)::before {
        content: "foobar";
        color: red;
    }
`.withBehaviors(
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    neutralFillHoverBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineRestBehavior,
    neutralForegroundHintBehavior
);

export const rangeInputTemplate = html<FastInput>`
    <slot name="label"></slot>
    <slot
        ${slotted({
            property: "controls",
            filter: elements("input"),
        })}
    ></slot>
`;
