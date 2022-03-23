import {
    textEditorTemplate,
    TextEditor,
    textEditorToolbarTemplate,
    TextEditorToolbar,
} from "@microsoft/fast-foundation";
import { textEditorStyles } from "./text-editor.styles";
import { textEditorToolbarStyles } from "./text-editor-toolbar.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#FastTextEditor} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#textEditorTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-text-editor>`
 */
export const fastTextEditor = TextEditor.compose({
    baseName: "text-editor",
    template: textEditorTemplate,
    styles: textEditorStyles,
});

/**
 * Base class for Text-Editor
 * @public
 */
export { TextEditor };

export { textEditorStyles };

/**
 * A function that returns a {@link @microsoft/fast-foundation#FastTextEditorToolbar} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#textEditorToolbarTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-text-editor-toolbar>`
 */
export const fastTextEditorToolbar = TextEditorToolbar.compose({
    baseName: "text-editor-toolbar",
    template: textEditorToolbarTemplate,
    styles: textEditorToolbarStyles,
});

/**
 * Base class for Text-Editor-Toolbar
 * @public
 */
export { TextEditorToolbar };

export { textEditorToolbarStyles };
