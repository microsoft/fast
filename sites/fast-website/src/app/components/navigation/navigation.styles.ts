import { css } from "@microsoft/fast-element";
import { neutralForegroundRestBehavior } from "@microsoft/fast-components";
import { display } from "@microsoft/fast-foundation";

export const NavigationStyles = css`
    ${display("flex")} :host {
        contain: content;
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        box-sizing: border-box;
        width: 100%;
    }
`.withBehaviors(neutralForegroundRestBehavior);
