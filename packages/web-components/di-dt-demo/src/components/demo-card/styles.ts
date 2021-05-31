import {
    cornerRadius,
    designUnit,
    fillColor,
    typeRampBaseFontSize,
    typeRampPlus1FontSize,
    typeRampPlus1LineHeight,
    typeRampPlus2FontSize,
    typeRampPlus2LineHeight,
} from "@microsoft/fast-components";
import { css, ElementStyles } from "@microsoft/fast-element";
import {
    DesignToken,
    display,
    ElementDefinitionContext,
} from "@microsoft/fast-foundation";

export const cardCornerRadius = DesignToken.create<number>(
    "card-corner-radius"
).withDefault(cornerRadius);

export const styles = (context: ElementDefinitionContext): ElementStyles => css`
    ${display("grid")} :host {
        grid-template-rows: calc(${designUnit} * 39px) 1fr auto calc(${designUnit} * 2px);
        background-color: ${fillColor};
        width: calc(${designUnit} * 75px);
        height: calc(${designUnit} * 76px);
        border-radius: calc(${cardCornerRadius} * 1px);
        contain: content;
    }

    .content,
    .footer {
        padding: 0 calc(${designUnit} * 2px);
    }

    slot[name="heading"]::slotted(*) {
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseFontSize};
    }

    fluent-button::part(control) {
        transition: padding 0.2s ease-in-out;
    }

    fluent-button:not(:hover)::part(control) {
        padding: 0;
    }
`;
