import { css } from "@microsoft/fast-element";
import { display } from "../../styles";
import { SystemColors } from "../../styles/system-colors";

export const ProgressRingStyles = css`
    ${display("flex")} :host {
        align-items: center;
        outline: none;
        height: calc(var(--height-number) * 1px);
        width: calc(var(--height-number) * 1px);
        margin: calc(var(--design-unit) * 1px) 0;
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
        stroke: var(--accent-fill-rest);
        fill: none;
        stroke-width: 2px;
        stroke-linecap: round;
        transform-origin: 50% 50%;
        transform: rotate(-90deg);
        transition: all 0.2s ease-in-out;
    }

    .indeterminate-indicator-1 {
        stroke: var(--accent-fill-rest);
        fill: none;
        stroke-width: 2px;
        stroke-linecap: round;
        transform-origin: 50% 50%;
        transform: rotate(-90deg);
        transition: all 0.2s ease-in-out;
        animation: spin-infinite 2s linear infinite;
    }

    :host(.paused) .indeterminate-indicator-1 {
        animation-play-state: paused;
        stroke: var(--neutral-fill-rest);
    }

    :host(.paused) .determinate {
        stroke: var(--neutral-foreground-hint);
    }

    @media (forced-colors: active) {
        .indeterminate-indicator-1,
        .determinate {
            stroke: ${SystemColors.FieldText};
        }

        .background {
            stroke: ${SystemColors.Field};
        }

        :host(.paused) .indeterminate-indicator-1 {
            stroke: ${SystemColors.Field};
        }

        :host(.paused) .determinate {
            stroke: ${SystemColors.GrayText};
        }
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
