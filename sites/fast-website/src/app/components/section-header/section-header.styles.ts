import { neutralForegroundRestBehavior } from "@microsoft/fast-components";
import { display } from "@microsoft/fast-foundation";
import { css } from "@microsoft/fast-element";

export const SectionHeaderStyles = css`
    ${display("flex")} :host {
        align-items: center;
        flex-direction: column;
        font-family: var(--body-font);
        color: ${neutralForegroundRestBehavior.var};
        box-sizing: border-box;
        text-align: center;
    }

    fast-badge ::slotted([slot="badge"]) {
        background-color: green;
        font-weight: bold;
        letter-spacing: 0.12em;
        padding: calc(var(--design-unit) * 1px) calc(var(--design-unit) * 4px);
    }
`.withBehaviors(neutralForegroundRestBehavior);
