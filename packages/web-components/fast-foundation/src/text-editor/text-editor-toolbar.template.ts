import { html, repeat, ViewTemplate } from "@microsoft/fast-element";
import { Alignment } from "roosterjs";
import {
    changeFontSize,
    clearFormat as clearFormatApi,
    FONT_SIZES,
    setAlignment,
    setBackgroundColor,
    setDirection,
    setFontSize,
    setIndentation,
    setTextColor,
    toggleBlockQuote,
    toggleBold,
    toggleBullet,
    toggleCodeBlock,
    toggleItalic,
    toggleNumbering,
    toggleStrikethrough,
    toggleSubscript,
    toggleSuperscript,
    toggleUnderline,
} from "roosterjs-editor-api";
import { Direction, FontSizeChange, Indentation } from "roosterjs-editor-types";
import type { FoundationElementTemplate } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import { Button } from "../button";
import { Combobox } from "../combobox";
import { ListboxOption } from "../listbox-option";
import { Picker } from "../picker";
import { Select } from "../select";
import { Toolbar } from "../toolbar";
import { Tooltip } from "../tooltip";
import type { TextEditorToolbar } from "./text-editor-toolbar";

function createDefaultToolbarTemplate(
    context: ElementDefinitionContext
): ViewTemplate<TextEditorToolbar> {
    const toolbarTag: string = context.tagFor(Toolbar);
    const buttonTag: string = context.tagFor(Button);
    const comboboxTag: string = context.tagFor(Combobox);
    const tooltipTag: string = context.tagFor(Tooltip);
    const pickerTag: string = context.tagFor(Picker);
    const selectTag: string = context.tagFor(Select);
    const optionTag: string = context.tagFor(ListboxOption);
    return html`
        <${toolbarTag}
            class="toolbar"
            part="toolbar"
        >
            <${buttonTag}
                id="bold-button"
                class="toolbar-item"
                appearance="outline"
                aria-pressed="${x => x.formatState.isBold}"
                @click="${x => toggleBold(x.editor)}"
            >
                ${x => x.resources["boldButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                auto-update-mode="auto"
                horizontal-viewport-lock="true"
                anchor="bold-button"
            >
                ${x => x.resources["boldButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="italic-button"
                class="toolbar-item"
                appearance="outline"
                aria-pressed="${x => x.formatState.isItalic}"
                @click="${x => toggleItalic(x.editor)}"
            >
                ${x => x.resources["italicButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="italic-button"
            >
                ${x => x.resources["italicButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="align-left-button"
                class="toolbar-item"
                appearance="outline"
                @click="${x => setAlignment(x.editor, Alignment.Left)}"
            >
                ${x => x.resources["alignLeftButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="align-left-button"
            >
                ${x => x.resources["alignLeftButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="align-center-button"
                class="toolbar-item"
                appearance="outline"
                @click="${x => setAlignment(x.editor, Alignment.Center)}"
            >
                ${x => x.resources["alignCenterButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="align-center-button"
            >
                ${x => x.resources["alignCenterButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="align-right-button"
                class="toolbar-item"
                appearance="outline"
                @click="${x => setAlignment(x.editor, Alignment.Right)}"
            >
                ${x => x.resources["alignRightButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="align-right-button"
            >
                ${x => x.resources["alignRightButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="bullet-button"
                class="toolbar-item"
                appearance="outline"
                @click="${x => toggleBullet(x.editor)}"
            >
                ${x => x.resources["bulletButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="bullet-button"
            >
                ${x => x.resources["bulletButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="code-button"
                class="toolbar-item"
                appearance="outline"
                @click="${x => toggleCodeBlock(x.editor)}"
            >
                ${x => x.resources["codeButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="code-button"
            >
                ${x => x.resources["codeButtonTooltip"]}
            </${tooltipTag}>

            <${selectTag}
                :value="${x => x.formatState.fontSize}"
                class="toolbar-item font-size-combobox"
                @change="${(x, c) => {
                    if (c.event.target) {
                        const newSize: string = (c.event.target as Combobox).value.trim();
                        setFontSize(x.editor, newSize);
                    }
                }}"
            >
                ${repeat(
                    x => FONT_SIZES,
                    html<string>`
                    <${optionTag}>${x => `${x}pt`}</${optionTag}>
                `
                )}
            </${selectTag}>

            <${selectTag}
                :value="${x => x.formatState.backgroundColor}"
                class="toolbar-item color-combobox"
                @change="${(x, c) => {
                    if (c.event.target) {
                        const newColor: string = (c.event
                            .target as Combobox).value.trim();
                        setBackgroundColor(x.editor, newColor);
                    }
                }}"
            >
                <${optionTag}>rgb(0, 0, 0)</${optionTag}>
                <${optionTag}>rgb(255, 255, 255)</${optionTag}>
                <${optionTag}>rgb(255, 0, 0)</${optionTag}>
                <${optionTag}>rgb(0, 255, 0)</${optionTag}>
                <${optionTag}>rgb(0, 0, 255)</${optionTag}>
            </${selectTag}>

            <${selectTag}
                :value="${x => x.formatState.textColor}"
                class="toolbar-item color-combobox"
                @change="${(x, c) => {
                    if (c.event.target) {
                        const newColor: string = (c.event.target as Select).value;
                        setTextColor(x.editor, newColor);
                    }
                }}"
            >
                <${optionTag}>rgb(0, 0, 0)</${optionTag}>
                <${optionTag}>rgb(255, 255, 255)</${optionTag}>
                <${optionTag}>rgb(255, 0, 0)</${optionTag}>
                <${optionTag}>rgb(0, 255, 0)</${optionTag}>
                <${optionTag}>rgb(0, 0, 255)</${optionTag}>
            </${selectTag}>

            <${buttonTag}
                id="clear-format-button"
                class="toolbar-item"
                appearance="outline"
                @click="${x => clearFormatApi(x.editor)}"
            >
                ${x => x.resources["clearFormatButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="clear-format-button"
            >
                ${x => x.resources["clearFormatButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="increase-size-button"
                class="toolbar-item"
                appearance="outline"
                @click="${x => changeFontSize(x.editor, FontSizeChange.Increase)}"
            >
                ${x => x.resources["increaseSizeButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="increase-size-button"
            >
                ${x => x.resources["increaseSizeButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="decrease-size-button"
                class="toolbar-item"
                appearance="outline"
                @click="${x => changeFontSize(x.editor, FontSizeChange.Decrease)}"
            >
                ${x => x.resources["decreaseSizeButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="decrease-size-button"
            >
                ${x => x.resources["decreaseSizeButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="increase-indent-button"
                class="toolbar-item"
                appearance="outline"
                @click="${x => setIndentation(x.editor, Indentation.Increase)}"
            >
                ${x => x.resources["increaseIndentButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="increase-indent-button"
            >
                ${x => x.resources["increaseIndentButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="decrease-indent-button"
                class="toolbar-item"
                appearance="outline"
                @click="${x => setIndentation(x.editor, Indentation.Decrease)}"
            >
                ${x => x.resources["decreaseIndentButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="decrease-indent-button"
            >
                ${x => x.resources["decreaseIndentButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="underline-button"
                class="toolbar-item"
                appearance="outline"
                aria-pressed="${x => x.formatState.isUnderline}"
                @click="${x => toggleUnderline(x.editor)}"
            >
                ${x => x.resources["underlineButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="underline-button"
            >
                ${x => x.resources["underlineButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="superscript-button"
                class="toolbar-item"
                appearance="outline"
                aria-pressed="${x => x.formatState.isSuperscript}"
                @click="${x => toggleSuperscript(x.editor)}"
            >
                ${x => x.resources["superscriptButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="${x => `superscript-button`}"
            >
                ${x => x.resources["superscriptButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="subscript-button"
                class="toolbar-item"
                appearance="outline"
                aria-pressed="${x => x.formatState.isSubscript}"
                @click="${x => toggleSubscript(x.editor)}"
            >
                ${x => x.resources["subscriptButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="${x => `subscript-button`}"
            >
                ${x => x.resources["subscriptButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="rtl-button"
                class="toolbar-item"
                appearance="outline"
                @click="${x => setDirection(x.editor, Direction.RightToLeft)}"
            >
                ${x => x.resources["rtlButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="rtl-button"
            >
                ${x => x.resources["rtlButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="ltr-button"
                class="toolbar-item"
                appearance="outline"
                @click="${x => setDirection(x.editor, Direction.LeftToRight)}"
            >
                ${x => x.resources["ltrButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="ltr-button"
            >
                ${x => x.resources["ltrButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="strikethrough-button"
                class="toolbar-item"
                appearance="outline"
                aria-pressed="${x => x.formatState.isStrikeThrough}"
                @click="${x => toggleStrikethrough(x.editor)}"
            >
                ${x => x.resources["strikethroughButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="strikethrough-button"
            >
                ${x => x.resources["strikethroughButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="blockquote-button"
                class="toolbar-item"
                appearance="outline"
                aria-pressed="${x => x.formatState.isBlockQuote}"
                @click="${x => toggleBlockQuote(x.editor)}"
            >
                ${x => x.resources["blockquoteButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="blockquote-button"
            >
                ${x => x.resources["blockquoteButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="numbering-button"
                class="toolbar-item"
                appearance="outline"
                aria-pressed="${x => x.formatState.isNumbering}"
                @click="${x => toggleNumbering(x.editor)}"
            >
                ${x => x.resources["numberingButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="numbering-button"
            >
                ${x => x.resources["numberingButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="undo-button"
                class="toolbar-item"
                appearance="outline"
                disabled="${x => !x.formatState.canUndo}"
            >
                ${x => x.resources["undoButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="undo-button"
            >
                ${x => x.resources["undoButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="redo-button"
                class="toolbar-item"
                appearance="outline"
                disabled="${x => !x.formatState.canRedo}"
            >
                ${x => x.resources["redoButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                class="tooltip"
                horizontal-viewport-lock="true"
                anchor="redo-button"
            >
                ${x => x.resources["redoButtonTooltip"]}
            </${tooltipTag}>
        </${toolbarTag}>
`;
}

/**
 * The template for the
 * @public
 */
export const textEditorToolbarTemplate: FoundationElementTemplate<ViewTemplate<
    TextEditorToolbar
>> = (context, definition) => {
    const defaultToolbarTemplate: ViewTemplate<TextEditorToolbar> = createDefaultToolbarTemplate(
        context
    );
    return html<TextEditorToolbar>`
        <template :defaultToolbarTemplate="${defaultToolbarTemplate}">
            <slot></slot>
        </template>
    `;
};
