import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";

import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentForegroundRestBehavior,
    heightNumber,
    neutralFillStealthActiveBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthRestBehavior,
    neutralFillStealthSelectedBehavior,
    neutralFocusBehavior,
    neutralFocusInnerAccentBehavior,
    neutralForegroundActiveBehavior,
    neutralForegroundRestBehavior,
} from "../styles/index";

export const TreeItemStyles = css`
    ${display("block")} :host {
        contain: content;
        position: relative;
        outline: none;
        color: var(--neutral-foreground-rest);
        background: var(--neutral-fill-stealth-rest);
        cursor: pointer;
        font-family: var(--body-font);
        --expand-collapse-button-size: calc(${heightNumber} * 1px);
        --tree-item-nested-width: 0;
    }

    :host(:focus) > .positioning-region {
        outline: none;
    }

    :host(:focus) .content-region {
        outline: none;
    }

    :host(:${focusVisible}) .positioning-region {
        border: var(--neutral-focus) 1px solid;
        border-radius: calc(var(--corner-radius) * 1px);
        color: var(--neutral-foreground-active);
    }

    .positioning-region {
        display: flex;
        position: relative;
        box-sizing: border-box;
        border: transparent 1px solid;
        height: calc(${heightNumber} * 1px);
    }

    .positioning-region::before {
        content: "";
        display: block;
        width: var(--tree-item-nested-width);
        flex-shrink: 0;
    }

    .positioning-region:hover {
        background: var(--neutral-fill-stealth-hover);
    }

    .positioning-region:active {
        background: var(--neutral-fill-stealth-active);
    }

    .content-region {
        display: flex;
        align-items: center;
        white-space: nowrap;
        width: 100%;
        height: calc(${heightNumber} * 1px);
        margin-inline-start: calc(var(--design-unit) * 2px + 2px);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        font-weight: 400;
    }

    .items {
        display: none;
        ${
            /* Font size should be based off calc(1em + (design-unit + glyph-size-number) * 1px) - 
            update when density story is figured out */ ""
        } font-size: calc(1em + var(--type-ramp-base-font-size));
    }

    .expand-collapse-button {
        background: none;
        border: none;
        outline: none;
        ${
            /* Width and Height should be based off calc(glyph-size-number + (design-unit * 4) * 1px) - 
            update when density story is figured out */ ""
        } width: var(--expand-collapse-button-size);
        height: var(--expand-collapse-button-size);
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .expand-collapse-glyph {
        ${
            /* Glyph size is temporary - 
            replace when glyph-size var is added */ ""
        } width: 16px;
        height: 16px;
        transition: transform 0.1s linear;
        ${/* transform needs to be localized */ ""} transform: rotate(-45deg);
        pointer-events: none;
        fill: var(--neutral-foreground-rest);
    }
    .start,
    .end {
        ${
            /* Glyph size is temporary - 
            replace when glyph-size var is added */ ""
        } width: 16px;
        height: 16px;
        fill: var(--neutral-foreground-rest);
    }

    .start {
        ${
            /* need to swap out once we understand how horizontalSpacing will work */ ""
        } margin-inline-end: calc(var(--design-unit) * 2px + 2px);
    }

    .end {
        ${
            /* need to swap out once we understand how horizontalSpacing will work */ ""
        } margin-inline-start: calc(var(--design-unit) * 2px + 2px);
    }

    :host(.expanded) > .positioning-region .expand-collapse-glyph {
        ${/* transform needs to be localized */ ""} transform: rotate(0deg);
    }

    :host(.expanded) > .items {
        display: block;
    }

    :host([disabled]) .content-region {
        opacity: var(--disabled-opacity);
        cursor: ${disabledCursor};
    }

    :host([selected]) .positioning-region {
        background: var(--neutral-fill-stealth-selected);
    }

    :host([selected])::after {
        content: "";
        display: block;
        position: absolute;
        top: calc((${heightNumber} / 4) * 1px);
        width: 3px;
        height: calc((${heightNumber} / 2) * 1px);
        ${
            /* The french fry background needs to be calculated based on the selected background state for this control.
            We currently have no way of chaning that, so setting to accent-foreground-rest for the time being */ ""
        } background: var(--accent-foreground-rest);
        ${
            /* value needs to be localized */ ""
        } left: calc(var(--focus-outline-width) * 1px);
        border-radius: calc(var(--corner-radius) * 1px);
    }

    :host(.nested) .content-region {
        position: relative;
        margin-inline-start: var(--expand-collapse-button-size);
    }

    :host(.nested) .expand-collapse-button {
        position: absolute;
        ${/* value needs to be localized  */ ""}
        left: var(--expand-collapse-button-nested-width, calc(var(--height-number) * -1px));
    }

    ::slotted(fast-tree-item) {
        --tree-item-nested-width: 1em;
        --expand-collapse-button-nested-width: calc(${heightNumber} * -1px);
    }
`.withBehaviors(
    accentForegroundRestBehavior,
    neutralFillStealthSelectedBehavior,
    neutralFillStealthActiveBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralFocusInnerAccentBehavior,
    neutralForegroundActiveBehavior,
    neutralForegroundRestBehavior,
    forcedColorsStylesheetBehavior(
        css`
        :host {
            forced-color-adjust: none;
            border-color: transparent;
            background: ${SystemColors.Field};
        }
        :host([selected]) .content-region {
            background: ${SystemColors.Highlight};
            color: ${SystemColors.HighlightText};
        }
        :host([selected]) .content-region .before-content,
        :host([selected]) .content-region .after-content,
        :host([selected]) .content-region .expand-collapse-glyph,
        .positioning-region:hover .before-content,
        .positioning-region:hover .after-content,
        .positioning-region:hover .expand-collapse-glyph,
        :host(:${focusVisible}:hover) .content-region .expand-collapse-glyph {
            fill: ${SystemColors.HighlightText};
        }
        :host(:${focusVisible}) .content-region {
            border-color: ${SystemColors.Highlight};
        }
        :host([selected]:${focusVisible}) .content-region {
            border-color: ${SystemColors.FieldText};
            box-shadow: 0 0 0 2px inset ${SystemColors.Field};
        }
        :host(:${focusVisible}:hover) .content-region,
        .positioning-region:hover {
            background: ${SystemColors.Highlight};
            color: ${SystemColors.HighlightText};
        }
        `
    )
);
