import { css } from "@microsoft/fast-element";
import { FASTTabPanel } from "../tab-panel.js";
import { tabPanelTemplate } from "../tab-panel.template.js";

const styles = css`
    :host([hidden]) {
        display: none;
    }
    :host {
        display: block;
        box-sizing: border-box;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
    }
`;

FASTTabPanel.define({
    name: "fast-tab-panel",
    styles,
    template: tabPanelTemplate(),
});
