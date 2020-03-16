import { css } from "@microsoft/fast-element";
import { display } from "../styles";

export const TreeItemStyles = css`
    ${display("block")} :host {
        contain: content;
        border-radius: var(--elevated-corner-radius);
    }
`;
