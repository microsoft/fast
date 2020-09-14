import { css } from "@microsoft/fast-element";
import { display } from '@microsoft/fast-foundation';
import { heightNumber, neutralFillStealthHoverBehavior, neutralForegroundRestBehavior, neutralLayerL1Behavior } from '../../styles';

export const OptionStyles = css`
    ${display("flex")} :host {
        position: relative;
        height: calc(${heightNumber} * 1px);
        color: ${neutralForegroundRestBehavior.var};
        align-items: center;
        padding: calc(var(--design-unit) * 2px + 1px);
        box-sizing: border-box;
    }

    :host[current] {
        background: ${neutralLayerL1Behavior.var}
    }

    :host(:hover) {
        background: ${neutralFillStealthHoverBehavior.var}
    }
`.withBehaviors(
    neutralFillStealthHoverBehavior,
    neutralForegroundRestBehavior,
    neutralLayerL1Behavior
);