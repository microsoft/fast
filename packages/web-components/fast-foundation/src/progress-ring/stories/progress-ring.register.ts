import { css } from "@microsoft/fast-element";
import { FASTProgressRing } from "../progress-ring.js";
import { progressRingTemplate } from "../progress-ring.template.js";

const styles = css`
    :host {
        align-items: center;
        display: flex;
        outline: none;
        height: calc(var(--height-number) * 1px);
        width: calc(var(--height-number) * 1px);
        margin: calc(var(--height-number) * 1px) 0;
    }

    .progress {
        height: 100%;
        width: 100%;
    }

    .background {
        stroke: var(--neutral-fill-rest);
        fill: none;
        stroke-width: 2px;
    }

    .determinate {
        stroke: var(--accent-foreground-rest);
        fill: none;
        stroke-width: 2px;
        stroke-linecap: round;
        transform-origin: 50% 50%;
        transform: rotate(-90deg);
        transition: all 0.2s ease-in-out;
    }

    .indeterminate-indicator-1 {
        stroke: var(--accent-foreground-rest);
        fill: none;
        stroke-width: 2px;
        stroke-linecap: round;
        transform-origin: 50% 50%;
        transform: rotate(-90deg);
        transition: all 0.2s ease-in-out;
        animation: spin-infinite 2s linear infinite;
    }

    :host([paused]) .indeterminate-indicator-1 {
        animation-play-state: paused;
        stroke: var(--neutral-fill-rest);
    }

    :host([paused]) .determinate {
        stroke: var(--neutral-foreground-hint);
    }

    @keyframes spin-infinite {
        0% {
            stroke-dasharray: 0.01px 43.97px;
            transform: rotate(0deg);
        }
        50% {
            stroke-dasharray: 21.99px 21.99px;
            transform: rotate(450deg);
        }
        100% {
            stroke-dasharray: 0.01px 43.97px;
            transform: rotate(1080deg);
        }
    }
`;

FASTProgressRing.define({
    name: "fast-progress-ring",
    template: progressRingTemplate({
        indeterminateIndicator: /* html */ `
            <svg class="progress" part="progress" viewBox="0 0 16 16">
                <circle
                    class="background"
                    part="background"
                    cx="8px"
                    cy="8px"
                    r="7px"
                ></circle>
                <circle
                    class="indeterminate-indicator-1"
                    part="indeterminate-indicator-1"
                    cx="8px"
                    cy="8px"
                    r="7px"
                ></circle>
            </svg>
        `,
    }),
    styles,
});
