import { css } from "@microsoft/fast-element";
import {
    AccentButtonStyles,
    accentForegroundCutRestBehavior,
    accentFillHoverBehavior,
    accentFillActiveBehavior,
    neutralFocusInnerAccentBehavior,
    accentFillRestBehavior,
    BaseButtonStyles,
    HypertextStyles,
    LightweightButtonStyles,
    OutlineButtonStyles,
    StealthButtonStyles,
} from "../styles/index";
import { appearanceBehavior } from "../utilities/behaviors";

export const AnchorStyles = css`
    ${BaseButtonStyles}
`.withBehaviors(
    appearanceBehavior("accent", AccentButtonStyles),
    appearanceBehavior("hypertext", HypertextStyles),
    appearanceBehavior("lightweight", LightweightButtonStyles),
    appearanceBehavior("outline", OutlineButtonStyles),
    appearanceBehavior("stealth", StealthButtonStyles)
);
