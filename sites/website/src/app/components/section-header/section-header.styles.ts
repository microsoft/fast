import { neutralForegroundRestBehavior } from "@microsoft/fast-components";
import { display } from "@microsoft/fast-foundation";
import { css } from "@microsoft/fast-element";

export const SectionHeaderStyles = css`
    ${display("flex")} :host {
        flex-direction: column;
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        box-sizing: border-box;
        text-align: center;
    }
`.withBehaviors(neutralForegroundRestBehavior);
