import {
    controlCornerRadius,
    designUnit,
    fillColor,
    neutralForegroundRest,
    typeRampMinus1FontSize,
    typeRampMinus1LineHeight,
    typeRampPlus1FontSize,
    typeRampPlus1LineHeight,
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";
import { DesignToken, display } from "@microsoft/fast-foundation";

/**
 * Not only can we have system-wide design tokens, but we can
 * have component-specific tokens as well.
 */
export const cardPadding = DesignToken.create<number>("card-padding").withDefault(
    (el: HTMLElement) => designUnit.getValueFor(el) * 2
);

export const demoCardStyles = css`
    ${display("grid")} :host {
        --elevation: 4;
        grid-template-rows: calc(${designUnit} * 39px) 1fr auto calc(${designUnit} * 2px);
        background-color: ${fillColor};
        width: calc(${designUnit} * 75px);
        height: calc(${designUnit} * 76px);
        border-radius: calc(${controlCornerRadius} * 1px);
        contain: content;
        margin: calc(${designUnit} * 2px);
        box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px)
                rgba(0, 0, 0, calc(0.11 * (2))),
            0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px))
                rgba(0, 0, 0, calc(0.13));
    }

    .feature-image {
        overflow: hidden;
    }

    .feature-image ::slotted(img) {
        place-self: stretch;
        width: 100%;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
    }

    .content,
    .footer {
        padding: 0 calc(${cardPadding} * 1px);
    }

    slot[name="heading"]::slotted(*) {
        color: ${neutralForegroundRest};
        font-size: ${typeRampPlus1FontSize};
        line-height: ${typeRampPlus1LineHeight};
        font-weight: 400;
        overflow: hidden;
        max-height: calc(${typeRampPlus1LineHeight} * 2);
    }

    fast-button::part(control) {
        transition: padding 0.2s ease-in-out;
    }

    fast-button:not(:hover)::part(control) {
        padding: 0;
    }

    ::slotted(fast-attribution) {
        margin-top: calc(${designUnit} * 2px);
        font-size: ${typeRampMinus1FontSize};
        line-height: ${typeRampMinus1LineHeight};
    }
`;
