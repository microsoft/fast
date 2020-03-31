import { css } from "@microsoft/fast-element";
import { display } from "../styles";

export const DesignSystemProviderStyles = css`
    ${display("block")} .inner {
        background-color: var(--background-color);
        font-family: Segoe UI, sans-serif;
    }
`;
