import { css } from "@microsoft/fast-element";
import { FASTTabs } from "../tabs.js";
import { tabsTemplate } from "../tabs.template.js";

const styles = css`
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
    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
        align-self: center;
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
    :host([orientation="vertical"]) ::slotted([slot="end"]) {
        grid-row: 3;
    }
`;

FASTTabs.define({
    name: "fast-tabs",
    styles,
    template: tabsTemplate(),
});
