import { css } from "@microsoft/fast-element";
import {
    AccentButtonStyles,
    BaseButtonStyles,
    LightweightButtonStyles,
    OutlineButtonStyles,
    StealthButtonStyles,
} from "../styles/index";

export const ButtonStyles = css`
    ${BaseButtonStyles}
    ${AccentButtonStyles}
    ${LightweightButtonStyles}
    ${OutlineButtonStyles}
    ${StealthButtonStyles}
`;
