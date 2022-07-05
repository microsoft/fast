import { css } from "@microsoft/fast-element";
import { FASTProgress } from "../progress.js";
import { progressTemplate } from "../progress.template.js";

const styles = css`
    :host {
        align-items: center;
        display: flex;
        contain: content;
        outline: none;
        height: calc(var(--design-unit) * 1px);
        margin: calc(var(--design-unit) * 1px) 0;
    }

    .progress {
        background-color: var(--neutral-fill-rest);
        border-radius: calc(var(--design-unit) * 1px);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;
    }

    .determinate {
        background-color: var(--accent-foreground-rest);
        border-radius: calc(var(--design-unit) * 1px);
        height: 100%;
        transition: all 0.2s ease-in-out;
        display: flex;
    }

    .indeterminate {
        border-radius: calc(var(--design-unit) * 1px);
        display: flex;
        height: 100%;
        overflow: hidden;
        position: relative;
        width: 100%;
    }

    .indeterminate-indicator-1 {
        animation: indeterminate-1 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        background-color: var(--accent-foreground-rest);
        border-radius: calc(var(--design-unit) * 1px);
        height: 100%;
        opacity: 0;
        position: absolute;
        width: 40%;
    }

    .indeterminate-indicator-2 {
        position: absolute;
        opacity: 0;
        height: 100%;
        background-color: var(--accent-foreground-rest);
        border-radius: calc(var(--design-unit) * 1px);
        width: 60%;
        animation: indeterminate-2 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    :host([paused]) .indeterminate-indicator-1,
    :host([paused]) .indeterminate-indicator-2 {
        animation-play-state: paused;
        background-color: var(--neutral-fill-rest);
    }

    :host([paused]) .determinate {
        background-color: var(--neutral-foreground-hint);
    }

    @keyframes indeterminate-1 {
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

    @keyframes indeterminate-2 {
        0% {
            opacity: 0;
            transform: translateX(-150%);
        }
        29.99% {
            opacity: 0;
        }
        30% {
            opacity: 1;
            transform: translateX(-150%);
        }
        100% {
            transform: translateX(166.66%);
            opacity: 1;
        }
    }
`;

FASTProgress.define({
    name: "fast-progress",
    template: progressTemplate({
        indeterminateIndicator1: /* html */ `
            <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>
        `,
        indeterminateIndicator2: /* html */ `
            <span class="indeterminate-indicator-2" part="indeterminate-indicator-2"></span>
        `,
    }),
    styles,
});
