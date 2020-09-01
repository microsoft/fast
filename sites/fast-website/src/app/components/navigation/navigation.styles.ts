import { css } from "@microsoft/fast-element";
import {
    neutralForegroundRestBehavior,
    neutralForegroundHintBehavior,
} from "@microsoft/fast-components";
import { display } from "@microsoft/fast-foundation";

export const NavigationStyles = css`
    ${display("grid")} :host {
        grid-template-columns: auto 1fr auto;
        font-family: var(--body-font);
        box-sizing: border-box;
        isolation: isolate;
        width: 100%;
    }

    .nav-button {
        display: none;
    }

    .nav-button svg {
        width: 35px;
        height: 19px;
    }

    .nav-list {
        align-items: center;
        display: flex;
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    li {
        margin: 0 30px;
        padding: 0;
    }

    .anchor-wrapper {
        display: grid;
        grid-template-columns: 1fr auto;
        width: 100%;
    }

    :host(.in-footer) .nav-button {
        display: none;
    }

    :host(.in-footer) ::slotted(fast-anchor),
    :host(.in-footer) ::slotted(p) {
        font-size: var(--type-ramp-minus-1-font-size);
        color: var(--neutral-foreground-hint);
    }

    :host(.in-footer) .end {
        align-self: flex-end;
    }

    :host(.in-header) {
        align-items: center;
        height: var(--navbar-height);
        justify-content: space-between;
        grid-column: 1 / end;
        grid-row: 1;
    }

    :host(.in-header)::before {
        background-color: var(--background-color);
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 0;
    }

    :host(.in-header) .nav-list {
        margin: 0;
        flex: 0 0 auto;
    }

    :host(.in-footer) ::slotted(site-navigation-item) {
        font-size: var(--type-ramp-plus-2-font-size);
    }

    @media screen and (min-width: 900px) {
        :host {
            grid-column: 2;
        }

        :host(.in-header) .nav-list {
            margin: 0 auto;
        }

        :host(.in-header) .end {
            margin-inline-start: auto;
        }

        :host(.in-header) ::slotted(site-navigation-item) {
            margin-bottom: 0;
        }

        .nav-button {
            display: none;
        }
    }

    @media screen and (max-width: 899px) {
        :host {
            align-items: center;
            position: relative;
            display: flex;
        }

        .nav-list {
            flex: 1 1 auto;
            flex-direction: column;
            align-items: flex-start;
        }

        :host(.opened) {
            padding-right: calc(var(--width-offset) * 1px);
        }

        .nav-button {
            display: block;
            margin-inline-start: auto;
            margin-inline-end: 20px;
            z-index: 2;
        }

        :host(.in-header) .anchor-wrapper {
            background-color: var(--background-color);
            color: ${neutralForegroundRestBehavior.var};
            display: flex;
            flex-direction: column;
            font-size: var(--type-ramp-plus-2-font-size);
            height: calc(100vh - 94px);
            left: 0;
            opacity: 0.95;
            position: absolute;
            top: 100%;
            transform: translateY(-100%);
            transition: transform 300ms ease-in-out 0s, visibility 0s linear 300ms;
            visibility: hidden;
            width: 100%;
            z-index: -1;
        }

        :host(.debounce) .anchor-wrapper {
            transition-duration: 0s;
        }

        :host(.opened) .anchor-wrapper {
            transform: translateY(0);
            transition-delay: 0s;
            visibility: visible;
        }
    }

    @media screen and (min-width: 900px) {
        :host(.in-header) .anchor-wrapper {
            justify-content: center;
        }

        :host(.in-header)::before {
            display: none;
        }
    }
`.withBehaviors(neutralForegroundRestBehavior, neutralForegroundHintBehavior);
