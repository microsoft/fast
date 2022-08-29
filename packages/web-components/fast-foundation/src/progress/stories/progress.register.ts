import { css } from "@microsoft/fast-element";
import { FASTProgress } from "../progress.js";
import { progressIndicatorTemplate, progressTemplate } from "../progress.template.js";

const styles = css`
    :host {
        align-items: center;
        display: flex;
        contain: content;
        outline: none;
        height: calc(var(--design-unit) * 1px);
        margin: calc(var(--design-unit) * 1px) 0;
        background-color: var(--neutral-fill-rest);
        border-radius: calc(var(--design-unit) * 1px);
        position: relative;
    }

    .determinate {
        background-color: var(--accent-foreground-rest);
        border-radius: calc(var(--design-unit) * 1px);
        height: 100%;
        transition: all 0.2s ease-in-out;
        display: flex;
        width: calc(var(--percent-complete) * 1%);
    }

    .indeterminate {
        border-radius: calc(var(--design-unit) * 1px);
        display: flex;
        height: 100%;
        overflow: hidden;
        position: relative;
        width: 100%;
    }

    .indeterminate .indicator {
        animation: indeterminate 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        background-color: var(--accent-foreground-rest);
        border-radius: calc(var(--design-unit) * 1px);
        height: 100%;
        opacity: 0;
        position: absolute;
        width: 40%;
    }

    :host([paused]) .determinate {
        background-color: var(--neutral-foreground-hint);
    }

    :host([paused]) .indeterminate .indicator {
        animation-play-state: paused;
        background-color: var(--neutral-fill-rest);
    }

    @keyframes indeterminate {
        0% {
            opacity: 1;
            transform: translateX(-100%);
        }
        70% {
            opacity: 1;
            transform: translateX(300%);
        }
        70.01% {
            opacity: 0;
        }
        100% {
            opacity: 0;
            transform: translateX(300%);
        }
    }
`;

FASTProgress.define({
    name: "fast-progress",
    template: progressTemplate({
        determinateIndicator: progressIndicatorTemplate,
        indeterminateIndicator: progressIndicatorTemplate,
    }),
    styles,
});
