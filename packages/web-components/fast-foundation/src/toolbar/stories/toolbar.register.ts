import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { Toolbar } from "../toolbar.js";
import { toolbarTemplate as template } from "../toolbar.template.js";

const styles = () => css`
    :host([hidden]) {
        display: none;
    }

    :host {
        --toolbar-item-gap: calc((var(--design-unit) + calc(var(--density) + 2)) * 1px);
        background-color: var(--fill-color);
        border-radius: calc(var(--control-corner-radius) * 1px);
        display: inline-flex;
        fill: currentcolor;
        padding: var(--toolbar-item-gap);
    }
    :host(var(--focus-visible)) {
        outline: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-focus);
    }
    .positioning-region {
        align-items: flex-start;
        display: inline-flex;
        flex-flow: row wrap;
        justify-content: flex-start;
    }
    :host([orientation="vertical"]) .positioning-region {
        flex-direction: column;
    }
    ::slotted(:not([slot])) {
        flex: 0 0 auto;
        margin: 0 var(--toolbar-item-gap);
    }
    :host([orientation="vertical"]) ::slotted(:not([slot])) {
        margin: var(--toolbar-item-gap) 0;
    }
    .start,
    .end {
        display: flex;
        margin: auto;
        margin-inline: 0;
    }
    ::slotted(svg) {
        width: 16px;
        height: 16px;
    }
`;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        Toolbar.compose({
            baseName: "toolbar",
            styles,
            template,
            shadowOptions: {
                delegatesFocus: true,
            },
        })()
    );
