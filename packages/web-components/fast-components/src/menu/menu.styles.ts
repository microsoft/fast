import { css } from "@microsoft/fast-element";
import { display, elevation } from "../styles";

export const MenuStyles = css`
    ${display("block")} :host {
        --elevation: 11;
        background: var(--neutral-layer-floating);
        border-radius: var(--elevated-corner-radius);
        ${elevation} margin: 0;
        padding: calc(var(--design-unit) * 1px) 0;
        max-width: 368px;
        min-width: 64px;
        transition: all 0.2s ease-in-out;
    }

    ::slotted(hr) {
        box-sizing: content-box;
        height: 0;
        margin: calc(var(--design-unit) * 1px) 0;
        border: none;
        border-top: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
        transition: "all 0.2s ease-in-out";
    }
`;
