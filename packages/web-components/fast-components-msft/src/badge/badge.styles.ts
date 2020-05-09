import { css } from "@microsoft/fast-element";
import {
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundRestBehavior,
    display,
    neutralFillInputRestBehavior,
    neutralFillToggleRestBehavior,
    neutralForegroundRestBehavior,
} from "@microsoft/fast-components";

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
        --badge-fill-lightweight: transparent;
        --badge-color-value: var(--neutral-foreground-rest);
        font-weight: 600;
    }

    :host(.accent) {
        --badge-fill-accent: var(--accent-fill-rest);
        --badge-color-value: var(--accent-foreground-cut-rest);
    }

    :host(.neutral) {
        --badge-fill-neutral: var(--neutral-fill-toggle-rest);
        --badge-color-value: var(--neutral-fill-input-rest);
    }
`.withBehaviors(
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundRestBehavior,
    neutralForegroundRestBehavior,
    neutralFillInputRestBehavior,
    neutralFillToggleRestBehavior
);
