import { css } from "@microsoft/fast-element";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    accentForegroundActiveBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundHoverBehavior,
    accentForegroundRestBehavior,
    neutralFillActiveBehavior,
    neutralFillFocusBehavior,
    neutralFillHoverBehavior,
    neutralFillRestBehavior,
    neutralFillStealthActiveBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralFocusInnerAccentBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineActiveBehavior,
    neutralOutlineHoverBehavior,
    neutralOutlineRestBehavior,
} from "@microsoft/fast-components";
import {
    AccentButtonStyles,
    BaseButtonStyles,
    HypertextStyles,
    LightweightButtonStyles,
    OutlineButtonStyles,
    StealthButtonStyles,
} from "../styles/index.js";

export const AnchorStyles = css`
    ${BaseButtonStyles}
    ${AccentButtonStyles}
    ${HypertextStyles}
    ${LightweightButtonStyles}
    ${OutlineButtonStyles}
    ${StealthButtonStyles}
`.withBehaviors(
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    accentForegroundActiveBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundHoverBehavior,
    accentForegroundRestBehavior,
    neutralFillActiveBehavior,
    neutralFillFocusBehavior,
    neutralFillHoverBehavior,
    neutralFillRestBehavior,
    neutralFillStealthActiveBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralFocusInnerAccentBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineActiveBehavior,
    neutralOutlineHoverBehavior,
    neutralOutlineRestBehavior
);
