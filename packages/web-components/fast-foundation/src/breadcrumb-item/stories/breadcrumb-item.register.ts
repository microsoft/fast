import { css } from "@microsoft/fast-element";
import { chevronRightIcon } from "../../icons.js";
import { FASTBreadcrumbItem } from "../breadcrumb-item.js";
import { breadcrumbItemTemplate } from "../breadcrumb-item.template.js";

const styles = css`
    :host {
        background: transparent;
        box-sizing: border-box;
        display: inline-flex;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        fill: currentColor;
        line-height: var(--type-ramp-base-line-height);
        min-width: calc(var(--height-number) * 1px);
        outline: none;
        color: var(--neutral-foreground-rest);
        display: flex;
        align-items: center;
        width: max-content;
    }

    .separator {
        margin: 0 6px;
        display: flex;
    }

    .control {
        align-items: center;
        box-sizing: border-box;
        color: var(--accent-foreground-rest);
        cursor: pointer;
        display: flex;
        fill: inherit;
        outline: none;
        text-decoration: none;
        white-space: nowrap;
    }

    .control:hover {
        color: var(--accent-foreground-hover);
    }

    .control:active {
        color: var(--accent-foreground-active);
    }

    .control .content {
        position: relative;
    }

    .control .content::before {
        content: "";
        display: block;
        height: calc(var(--stroke-width) * 1px);
        left: 0;
        position: absolute;
        right: 0;
        top: calc(1em + 4px);
        width: 100%;
    }

    .control:hover .content::before {
        background: var(--accent-foreground-hover);
    }

    .control:active .content::before {
        background: var(--accent-foreground-active);
    }

    .control:focus-visible .content::before {
        background: var(--neutral-foreground-rest);
        height: calc(var(--focus-stroke-width) * 1px);
    }

    .control:not([href]) {
        color: var(--neutral-foreground-rest);
        cursor: default;
    }

    .control:not([href]) .content::before {
        background: none;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]),
    .content {
        align-self: center;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }

    ::slotted([slot="start"]) {
        margin-inline-end: 11px;
    }

    ::slotted([slot="end"]) {
        margin-inline-start: 11px;
    }
`;

FASTBreadcrumbItem.define({
    name: "fast-breadcrumb-item",
    template: breadcrumbItemTemplate({
        separator: chevronRightIcon,
    }),
    styles,
});
