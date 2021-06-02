import { css } from "@microsoft/fast-element";
import { AvatarOptions, display } from "@microsoft/fast-foundation";
import {
    baseHeightMultiplier,
    cornerRadius,
    density,
    designUnit,
    neutralForegroundRest,
    typeRampBaseFontSize,
    typeRampPlus5LineHeight,
} from "../design-tokens";

export const avatarStyles = (context, definition: AvatarOptions) =>
    css`
        ${display("flex")} :host {
            position: relative;
            height: var(--avatar-size, var(--avatar-size-default));
            max-width: var(--avatar-size, var(--avatar-size-default));
            --avatar-size-default: calc(
                (
                        (${baseHeightMultiplier} + ${density}) * ${designUnit} +
                            ((${designUnit} * 8) - 40)
                    ) * 1px
            );
            --avatar-text-size: ${typeRampBaseFontSize};
            --avatar-text-ratio: ${designUnit};
        }

        .link {
            text-decoration: none;
            color: ${neutralForegroundRest};
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-width: 100%;
        }

        .square {
            border-radius: calc(${cornerRadius} * 1px);
            min-width: 100%;
            overflow: hidden;
        }

        .circle {
            border-radius: 100%;
            min-width: 100%;
            overflow: hidden;
        }

        .coin {
            position: relative;
            display: flex;
        }

        .image,
        ::slotted(img) {
            max-width: 100%;
            position: absolute;
            display: block;
        }

        .name {
            font-size: calc(
                (var(--avatar-text-size) + var(--avatar-size, var(--avatar-size-default))) /
                    var(--avatar-text-ratio)
            );
            line-height: ${typeRampPlus5LineHeight};
            display: block;
        }

        ::slotted(fast-badge) {
            position: absolute;
            display: block;
            bottom: 0;
            right: 0;
        }
    `;
