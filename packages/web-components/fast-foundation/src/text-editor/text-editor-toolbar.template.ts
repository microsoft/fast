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
                id="${x => `${x.instanceId}-bold-button`}"
                appearance="outline"
                aria-pressed="${x => x.formatState.isBold}"
                @click="${x => toggleBold(x.editor)}"
            >
                ${x => x.resources["boldButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `${x.instanceId}-bold-button`}"
            >
                ${x => x.resources["boldButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `${x.instanceId}-italic-button`}"
                appearance="outline"
                aria-pressed="${x => x.formatState.isItalic}"
                @click="${x => toggleItalic(x.editor)}"
            >
                ${x => x.resources["italicButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `${x.instanceId}-italic-button`}"
            >
                ${x => x.resources["italicButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `${x.instanceId}-align-left-button`}"
                appearance="outline"
                @click="${x => setAlignment(x.editor, Alignment.Left)}"
            >
                ${x => x.resources["alignLeftButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `${x.instanceId}-align-left-button`}"
            >
                ${x => x.resources["alignLeftButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `${x.instanceId}-align-center-button`}"
                appearance="outline"
                @click="${x => setAlignment(x.editor, Alignment.Center)}"
            >
                ${x => x.resources["alignCenterButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `${x.instanceId}-align-center-button`}"
            >
                ${x => x.resources["alignCenterButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `${x.instanceId}-align-right-button`}"
                appearance="outline"
                @click="${x => setAlignment(x.editor, Alignment.Right)}"
            >
                ${x => x.resources["alignRightButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `${x.instanceId}-align-right-button`}"
            >
                ${x => x.resources["alignRightButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `bullet-button`}"
                appearance="outline"
                @click="${x => toggleBullet(x.editor)}"
            >
                ${x => x.resources["bulletButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `bullet-button`}"
            >
                ${x => x.resources["bulletButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `code-button`}"
                appearance="outline"
                @click="${x => toggleCodeBlock(x.editor)}"
            >
                ${x => x.resources["codeButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `code-button`}"
            >
                ${x => x.resources["codeButtonTooltip"]}
            </${tooltipTag}>

            <${comboboxTag}
                :value="${x => x.formatState.fontSize}"
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
                    <${optionTag}>
                        ${x => `${x}pt`}
                    </${optionTag}>
                `
                )}
            </${comboboxTag}>

            <${comboboxTag}
                :value="${x => x.formatState.backgroundColor}"
                @change="${(x, c) => {
                    if (c.event.target) {
                        const newColor: string = (c.event
                            .target as Combobox).value.trim();
                        setBackgroundColor(x.editor, newColor);
                    }
                }}"
            >
            <${optionTag}>
                    rgb(0,0,0)
                </${optionTag}>
                <${optionTag}>
                    rgb(255,255,255)
                </${optionTag}>
                <${optionTag}>
                    rgb(255,0,0)
                </${optionTag}>
                <${optionTag}>
                    rgb(0,255,0)
                </${optionTag}>
                <${optionTag}>
                    rgb(0,0,255)
                </${optionTag}>
            </${comboboxTag}>

            <${comboboxTag}
                :value="${x => x.formatState.textColor}"
                @change="${(x, c) => {
                    if (c.event.target) {
                        const newColor: string = (c.event
                            .target as Combobox).value.trim();
                        setTextColor(x.editor, newColor);
                    }
                }}"
            >
                <${optionTag}>
                    rgb(0,0,0)
                </${optionTag}>
                <${optionTag}>
                    rgb(255,255,255)
                </${optionTag}>
                <${optionTag}>
                    rgb(255,0,0)
                </${optionTag}>
                <${optionTag}>
                    rgb(0,255,0)
                </${optionTag}>
                <${optionTag}>
                    rgb(0,0,255)
                </${optionTag}>
            </${comboboxTag}>

            <${buttonTag}
                id="${x => `${x.instanceId}-undo-button`}"
                appearance="outline"
                disabled="${x => !x.formatState.canUndo}"
            >
                ${x => x.resources["undoButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `${x.instanceId}-undo-button`}"
            >
                ${x => x.resources["undoButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `${x.instanceId}-redo-button`}"
                appearance="outline"
                disabled="${x => !x.formatState.canRedo}"
            >
                ${x => x.resources["redoButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `${x.instanceId}-redo-button`}"
            >
                ${x => x.resources["redoButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `clear-format-button`}"
                appearance="outline"
                @click="${x => clearFormatApi(x.editor)}"
            >
                ${x => x.resources["clearFormatButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `clear-format-button`}"
            >
                ${x => x.resources["clearFormatButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `increase-size-button`}"
                appearance="outline"
                @click="${x => changeFontSize(x.editor, FontSizeChange.Increase)}"
            >
                ${x => x.resources["increaseSizeButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `increase-size-button`}"
            >
                ${x => x.resources["increaseFontSizeButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `decrease-size-button`}"
                appearance="outline"
                @click="${x => changeFontSize(x.editor, FontSizeChange.Decrease)}"
            >
                ${x => x.resources["decreaseSizeButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `decrease-size-button`}"
            >
                ${x => x.resources["decreaseSizeButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `increase-indent-button`}"
                appearance="outline"
                @click="${x => setIndentation(x.editor, Indentation.Increase)}"
            >
                ${x => x.resources["increaseIndentButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `increase-indent-button`}"
            >
                ${x => x.resources["increaseIndentButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `decrease-indent-button`}"
                appearance="outline"
                @click="${x => setIndentation(x.editor, Indentation.Decrease)}"
            >
                ${x => x.resources["decreaseIndentButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `decrease-indent-button`}"
            >
                ${x => x.resources["decreaseIndentButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `underline-button`}"
                appearance="outline"
                aria-pressed="${x => x.formatState.isUnderline}"
                @click="${x => toggleUnderline(x.editor)}"
            >
                ${x => x.resources["underlineButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `underline-button`}"
            >
                ${x => x.resources["underlineButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `superscript-button`}"
                appearance="outline"
                aria-pressed="${x => x.formatState.isSuperscript}"
                @click="${x => toggleSuperscript(x.editor)}"
            >
                ${x => x.resources["superscriptButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `superscript-button`}"
            >
                ${x => x.resources["superscriptButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `subscript-button`}"
                appearance="outline"
                aria-pressed="${x => x.formatState.isSubscript}"
                @click="${x => toggleSubscript(x.editor)}"
            >
                ${x => x.resources["subscriptButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `subscript-button`}"
            >
                ${x => x.resources["subscriptButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `rtl-button`}"
                appearance="outline"
                @click="${x => setDirection(x.editor, Direction.RightToLeft)}"
            >
                ${x => x.resources["rtlButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `rtl-button`}"
            >
                ${x => x.resources["rtlButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `ltr-button`}"
                appearance="outline"
                @click="${x => setDirection(x.editor, Direction.LeftToRight)}"
            >
                ${x => x.resources["ltrButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `ltr-button`}"
            >
                ${x => x.resources["ltrButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `strikethrough-button`}"
                appearance="outline"
                aria-pressed="${x => x.formatState.isStrikeThrough}"
                @click="${x => toggleStrikethrough(x.editor)}"
            >
                ${x => x.resources["strikethroughButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `strikethrough-button`}"
            >
                ${x => x.resources["strikethroughButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `blockquote-button`}"
                appearance="outline"
                aria-pressed="${x => x.formatState.isBlockQuote}"
                @click="${x => toggleBlockQuote(x.editor)}"
            >
                ${x => x.resources["blockquoteButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `blockquote-button`}"
            >
                ${x => x.resources["blockquoteButtonTooltip"]}
            </${tooltipTag}>

            <${buttonTag}
                id="${x => `numbering-button`}"
                appearance="outline"
                aria-pressed="${x => x.formatState.isNumbering}"
                @click="${x => toggleNumbering(x.editor)}"
            >
                ${x => x.resources["numberingButtonTitle"]}
            </${buttonTag}>
            <${tooltipTag}
                position="bottom"
                horizontal-viewport-lock="true"
                anchor="${x => `numbering-button`}"
            >
                ${x => x.resources["numberingButtonTooltip"]}
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
