import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    neutralFocusBehavior,
    neutralOutlineFocusBehavior,
    neutralOutlineRestBehavior,
} from "../styles/recipes";

export const ListboxStyles = css`
    ${display("inline-flex")} :host {
        background: var(--background-color);
        border: calc(var(--outline-width) * 1px) solid ${neutralOutlineRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        flex-direction: column;
    }

    :host(:focus-within:not([disabled])) {
        border-color: ${neutralFocusBehavior.var};
        box-shadow: 0 0 0 1px ${neutralFocusBehavior.var} inset;
    }

    ::slotted([role="option"]) {
        width: 100%;
    }
`.withBehaviors(neutralOutlineRestBehavior, neutralOutlineFocusBehavior);
