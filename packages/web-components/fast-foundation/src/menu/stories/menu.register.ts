import { css } from "@microsoft/fast-element";
import { FASTMenu } from "../menu.js";
import { menuTemplate } from "../menu.template.js";

const styles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        --elevation: 11;
        background: var(--neutral-layer-floating);
        border: calc(var(--stroke-width) * 1px) solid transparent;
        border-radius: calc(var(--control-corner-radius) * 1px);
        box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px)
                rgba(0, 0, 0, calc(0.11 * (2 - var(--background-luminance, 1)))),
            0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px))
                rgba(0, 0, 0, calc(0.13 * (2 - var(--background-luminance, 1))));
        display: block;
        margin: 0;
        max-width: 368px;
        min-width: 64px;
        padding: calc(var(--design-unit) * 1px) 0;
    }

    :host([slot="submenu"]) {
        margin: 0 calc(var(--design-unit) * 1px);
        width: max-content;
    }

    ::slotted(hr) {
        border: none;
        border-top: calc(var(--stroke-width) * 1px) solid
            var(--neutral-stroke-divider-rest);
        box-sizing: content-box;
        height: 0;
        margin: 0;
    }
`;

FASTMenu.define({
    name: "fast-menu",
    styles,
    template: menuTemplate(),
});
