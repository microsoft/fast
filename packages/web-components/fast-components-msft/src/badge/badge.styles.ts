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
        font-size: var(--type-ramp-minus-1-font-size);
        line-height: var(--type-ramp-minus-1-height);
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
