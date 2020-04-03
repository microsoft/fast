import { css } from "@microsoft/fast-element";
import { display } from "../styles";

export const ButtonStyles = css`
    ${display("inline-block")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
    }
`;
