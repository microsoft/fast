import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
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
`.withBehaviors(
    forcedColorsStylesheetBehavior(
        css`
            :host([disabled]),
            :host([disabled]) .control {
                forced-color-adjust: none;
                background: ${SystemColors.ButtonFace};
                border-color: ${SystemColors.GrayText};
                color: ${SystemColors.GrayText};
                cursor: ${disabledCursor};
                opacity: 1;
            }
            :host([appearance="accent"]) .control {
                forced-color-adjust: none;
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
            }
    
            :host([appearance="accent"]) .control:hover {
                background: ${SystemColors.HighlightText};
                border-color: ${SystemColors.Highlight};
                color: ${SystemColors.Highlight};
            }
    
            :host([appearance="accent"]:${focusVisible}) .control {
                border-color: ${SystemColors.ButtonText};
                box-shadow: 0 0 0 2px ${SystemColors.HighlightText} inset;
            }
    
            :host([appearance="accent"][disabled]) .control,
            :host([appearance="accent"][disabled]) .control:hover {
                background: ${SystemColors.ButtonFace};
                border-color: ${SystemColors.GrayText};
                color: ${SystemColors.GrayText};
            }
            :host([appearance="lightweight"]) .control:hover {
                forced-color-adjust: none;
                color: ${SystemColors.Highlight};
            }
    
            :host([appearance="lightweight"]) .control:hover .content::before {
                background: ${SystemColors.Highlight};
            }
    
            :host([appearance="lightweight"][disabled]) .control {
                forced-color-adjust: none;
                color: ${SystemColors.GrayText};
            }
        
            :host([appearance="lightweight"][disabled]) .control:hover .content::before {
                background: none;
            }
            :host([appearance="outline"][disabled]) .control {
                border-color: ${SystemColors.GrayText};
            }
            :host([appearance="stealth"]) .control {
                forced-color-adjust: none;
                background: none;
                border-color: transparent;
                color: ${SystemColors.ButtonText};
                fill: currentcolor;
            }
            :host([appearance="stealth"]) .control:hover,
            :host([appearance="stealth"]:${focusVisible}) .control {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
            }
            :host([appearance="stealth"][disabled]) .control {
                background: none;
                border-color: transparent;
                color: ${SystemColors.GrayText};
            }
        `
    )
);
