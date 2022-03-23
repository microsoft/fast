import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Alignment } from "roosterjs";
import { setAlignment, toggleBold, toggleItalic } from "roosterjs-editor-api";
import type { FoundationElementTemplate } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import { Button } from "../button";
import { Toolbar } from "../toolbar";
import { Tooltip } from "../tooltip";
import type { TextEditorToolbar } from "./text-editor-toolbar";

function createDefaultToolbarTemplate(
    context: ElementDefinitionContext
): ViewTemplate<TextEditorToolbar> {
    const toolbarTag: string = context.tagFor(Toolbar);
    const buttonTag: string = context.tagFor(Button);
    const tooltipTag: string = context.tagFor(Tooltip);
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
        <template
            slot="toolbar-region"
            :defaultToolbarTemplate="${defaultToolbarTemplate}"
        >
            <slot></slot>
        </template>
    `;
};
