import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { Dialog } from "../dialog.js";
import { dialogTemplate as template } from "../dialog.template.js";

const styles = () => css`
    :host([hidden]) {
        display: none;
    }

    :host {
        --elevation: 14;
        --dialog-height: 480px;
        --dialog-width: 640px;
        display: block;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        touch-action: none;
    }

    .positioning-region {
        display: flex;
        justify-content: center;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
    }

    .control {
        box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px)
                rgba(0, 0, 0, calc(0.11 * (2 - var(--background-luminance, 1)))),
            0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px))
                rgba(0, 0, 0, calc(0.13 * (2 - var(--background-luminance, 1))));
        margin-top: auto;
        margin-bottom: auto;
        width: var(--dialog-width);
        height: var(--dialog-height);
        background-color: var(--fill-color);
        z-index: 1;
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid transparent;
    }
`;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        Dialog.compose({
            baseName: "dialog",
            template,
            styles,
        })()
    );
