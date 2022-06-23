import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { TabPanel } from "../tab-panel.js";
import { tabPanelTemplate as template } from "../tab-panel.template.js";

const styles = () => css`
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

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        TabPanel.compose({
            baseName: "tab-panel",
            styles,
            template,
        })()
    );
