import { customElement, html, css, FASTElement } from "@microsoft/fast-element";
import { display, focusVisible } from "@microsoft/fast-foundation";
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

const template = html`
    <slot name="label"></slot>
    <slot></slot>
`;

const styles = css`
    ${display("inline-flex")}

    :host {
        font-family: var(--body-font);
        flex-direction: column;
    }

    ::slotted(label) {
        display: block;
        color: ${neutralForegroundRestBehavior.var};
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        margin-bottom: 4px;
    }

    ::slotted(input) {
        box-sizing: border-box;
        padding: 0 calc(var(--design-unit) * 2px + 1px);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        color: ${neutralForegroundRestBehavior.var};
        background: ${neutralFillInputRestBehavior.var} !important;
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid ${accentFillRestBehavior.var};
        height: calc(${heightNumber} * 1px);
        outline: none;
        padding: 1px 12px;
    }
    ::slotted(input:-webkit-autofill) {
        box-shadow: 0 0 0px 1000px ${neutralFillInputRestBehavior.var} inset;
        -webkit-text-fill-color: ${neutralForegroundRestBehavior.var};
        color: ${neutralForegroundRestBehavior.var};
    }

    ::slotted(input)::placeholder {
        color: ${neutralForegroundHintBehavior.var};
    }

    ::slotted(input:${focusVisible}) {
        border-color: ${neutralFocusBehavior.var};
        border: 2px solid ${neutralFocusBehavior.var};
        padding: 0px 11px;
    }

    ::slotted(input[disabled]) {
        opacity: var(--disabled-opacity);
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

@customElement({
    name: "fast-input",
    template,
    styles,
})
export class FastInput extends FASTElement {}
