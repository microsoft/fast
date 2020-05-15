import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    neutralFillRestBehavior,
    neutralForegroundRestBehavior,
} from "../styles";

export const BadgeStyles = css`
    ${display("inline-block")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        ${/* Font size, weight, and line height are temporary - 
            replace when adaptive typography is figured out */ ""} font-size: 12px;
        font-weight: 400;
        line-height: 18px;
    }

    .badge {
        border-radius: calc(var(--corner-radius) * 1px);
        padding: calc(var(--design-unit) * 0.5px) calc(var(--design-unit) * 1px);
    }

    :host(.lightweight) {
        background: transparent;
        color: var(--neutral-foreground-rest);
        font-weight: 600;
    }

    :host(.accent) {
        background: var(--accent-fill-rest);
        color: var(--accent-foreground-cut-rest);
    }

    :host(.neutral) {
        background: var(--neutral-fill-rest);
        color: var(--neutral-foreground-rest);
    }
`.withBehaviors(
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    neutralFillRestBehavior,
    neutralForegroundRestBehavior
);
