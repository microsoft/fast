import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-components";

export const NavigationStyles = css`
    ${display("flex")} :host {
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        box-sizing: border-box;
    }
`;
