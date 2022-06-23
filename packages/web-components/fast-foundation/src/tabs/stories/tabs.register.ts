import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { Tabs } from "../tabs.js";
import { tabsTemplate as template } from "../tabs.template.js";

const styles = () => css`
    :host([hidden]) {
        display: none;
    }
    :host {
        display: grid;
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        color: var(--neutral-foreground-rest);
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto 1fr;
    }
    .tablist {
        display: grid;
        grid-template-rows: auto auto;
        grid-template-columns: auto;
        position: relative;
        width: max-content;
        align-self: end;
        padding: calc(var(--design-unit) * 4px) calc(var(--design-unit) * 4px) 0;
        box-sizing: border-box;
    }
    .start,
    .end {
        align-self: center;
    }
    .activeIndicator {
        grid-row: 2;
        grid-column: 1;
        width: 100%;
        height: 5px;
        justify-self: center;
        background: var(--accent-fill-rest);
        margin-top: 10px;
        border-radius: calc(var(--control-corner-radius) * 1px)
            calc(var(--control-corner-radius) * 1px) 0 0;
    }
    .activeIndicatorTransition {
        transition: transform 0.2s ease-in-out;
    }
    .tabpanel {
        grid-row: 2;
        grid-column-start: 1;
        grid-column-end: 4;
        position: relative;
    }
    :host([orientation="vertical"]) {
        grid-template-rows: auto 1fr auto;
        grid-template-columns: auto 1fr;
    }
    :host([orientation="vertical"]) .tablist {
        grid-row-start: 2;
        grid-row-end: 2;
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: auto 1fr;
        position: relative;
        width: max-content;
        justify-self: end;
        align-self: flex-start;
        width: 100%;
        padding: 0 calc(var(--design-unit) * 4px)
            calc((var(--height-number) - var(--design-unit)) * 1px) 0;
    }
    :host([orientation="vertical"]) .tabpanel {
        grid-column: 2;
        grid-row-start: 1;
        grid-row-end: 4;
    }
    :host([orientation="vertical"]) .end {
        grid-row: 3;
    }
    :host([orientation="vertical"]) .activeIndicator {
        grid-column: 1;
        grid-row: 1;
        width: 5px;
        height: 100%;
        margin-inline-end: 10px;
        align-self: center;
        background: var(--accent-fill-rest);
        margin-top: 0;
        border-radius: 0 calc(var(--control-corner-radius) * 1px)
            calc(var(--control-corner-radius) * 1px) 0;
    }
    :host([orientation="vertical"]) .activeIndicatorTransition {
        transition: transform 0.2s linear;
    }
`;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        Tabs.compose({
            baseName: "tabs",
            styles,
            template,
        })()
    );
