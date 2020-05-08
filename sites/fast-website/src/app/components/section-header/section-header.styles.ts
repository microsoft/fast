import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-components";

export const SectionHeaderStyles = css`
    ${display("flex")} :host {
        flex-direction: column;
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        box-sizing: border-box;
        text-align: center;
    }
`;
