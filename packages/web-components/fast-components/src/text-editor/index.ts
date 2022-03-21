import { textEditorTemplate as template, TextEditor } from "@microsoft/fast-foundation";
import { textEditorStyles as styles } from "./text-editor.styles";

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
    template,
    styles,
});

/**
 * Base class for Text-Editor
 * @public
 */
export { TextEditor };

export { styles as textEditorStyles };
