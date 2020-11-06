import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    neutralFocusBehavior,
    neutralLayerFloatingBehavior,
    neutralOutlineFocusBehavior,
    neutralOutlineRestBehavior,
} from "../styles/recipes";

export const ListboxStyles = css`
    ${display("inline-flex")} :host {
        background: ${neutralLayerFloatingBehavior.var};
        border: calc(var(--outline-width) * 1px) solid ${neutralOutlineRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        box-sizing: border-box;
        flex-direction: column;
        padding: calc(var(--design-unit) * 1px) 0;
    }

    :host(:focus-within:not([disabled])) {
        border-color: ${neutralFocusBehavior.var};
        box-shadow: 0 0 0 1px ${neutralFocusBehavior.var} inset;
    }
`.withBehaviors(
    neutralLayerFloatingBehavior,
    neutralOutlineRestBehavior,
    neutralOutlineFocusBehavior
);
