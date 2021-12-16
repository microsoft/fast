import {
    Dialog,
    FoundationElementDefinition,
    dialogTemplate as template,
} from "@microsoft/fast-foundation";
import { dialogStyles as styles } from "./dialog.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Dialog} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#dialogTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-dialog>`
 */
export const fastDialog = Dialog.compose<FoundationElementDefinition, typeof Dialog>({
    baseName: "dialog",
    template,
    styles,
});

/**
 * Base class for Dialog
 * @public
 */
export { Dialog };

export { styles as dialogStyles };
