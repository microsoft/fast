import {
    cornerRadius,
    designUnit,
    elevation,
    fillColor,
    neutralForegroundRest,
    typeRampBaseFontSize,
    typeRampPlus1FontSize,
    typeRampPlus1LineHeight,
    typeRampPlus2FontSize,
    typeRampPlus2LineHeight,
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";
import { DesignToken, display } from "@microsoft/fast-foundation";

export const cardCornerRadius = DesignToken.create<number>(
    "card-corner-radius"
).withDefault(cornerRadius);

export const demoCardStyles = css`
    ${display("grid")} :host {
        --elevation: 4;
        grid-template-rows: calc(${designUnit} * 39px) 1fr auto calc(${designUnit} * 2px);
        background-color: ${fillColor};
        width: calc(${designUnit} * 75px);
        height: calc(${designUnit} * 76px);
        border-radius: calc(${cardCornerRadius} * 1px);
        contain: content;
        margin: calc(${designUnit} * 2px);
        ${elevation}
    }

    .feature-image {
        place-self: stretch;
        width: 100%;
    }
    .content,
    .footer {
        padding: 0 calc(${designUnit} * 2px);
    }

    slot[name="heading"]::slotted(*) {
        color: ${neutralForegroundRest};
        font-size: ${typeRampPlus2FontSize};
        line-height: ${typeRampPlus2LineHeight};
        font-weight: 400;
    }

    fluent-button::part(control) {
        transition: padding 0.2s ease-in-out;
    }

    fluent-button:not(:hover)::part(control) {
        padding: 0;
    }
`;
