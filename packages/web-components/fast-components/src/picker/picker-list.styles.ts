import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { neutralFillInputRest, neutralForegroundRest } from "../design-tokens";

export const pickerListStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
    :host {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        z-index: 1000;
    }

    ::slotted(.input-element) {
        box-sizing: border-box;
        background: ${neutralFillInputRest};
        color: ${neutralForegroundRest};
        border-width: 0;
        outline: 0;
        min-width: 260px;
        width: auto;
        height: 58px;
        margin: 0 8px;
    }
    
    ::slotted([role="listitem"]) {
        min-width: 260px;
        min-height: 58px;
    }

    ::slotted(:${focusVisible}[role="listitem"]) {
        background: ${SystemColors.Highlight};
        border-color: ${SystemColors.ButtonText};
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset ${SystemColors.HighlightText};
        color: ${SystemColors.HighlightText};
        fill: currentcolor;
    }
`.withBehaviors(forcedColorsStylesheetBehavior(css``));
