import { css } from "@microsoft/fast-element";
import { display, forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    cornerRadius,
    designUnit,
    neutralLayerFloating,
    outlineWidth,
} from "../design-tokens";
import { elevation } from "../styles/index";

export const menuStyles = (context, definition) =>
    css`
        ${display("block")} :host {
            --elevation: 11;
            background: ${neutralLayerFloating};
            border: calc(${outlineWidth} * 1px) solid transparent;
            ${elevation}
            margin: 0;
            border-radius: calc(${cornerRadius} * 1px);
            padding: calc(${designUnit} * 1px) 0;
            max-width: 368px;
            min-width: 64px;
        }

        :host([slot="submenu"]) {
            width: max-content;
            margin: 0 calc(${designUnit} * 1px);
        }

        ::slotted(hr) {
            box-sizing: content-box;
            height: 0;
            margin: 0;
            border: none;
            border-top: calc(${outlineWidth} * 1px) solid var(--neutral-divider-rest);
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    background: ${SystemColors.Canvas};
                    border-color: ${SystemColors.CanvasText};
                }
            `
        )
    );
