import { Dialog, dialogTemplate as template } from "@microsoft/fast-foundation";
import { dialogStyles as styles } from "./dialog.styles";

/**
 * A function that returns a Dialog registration for configuring the component with a DesignSystem.
 * Implements Dialog
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-dialog\>
 */
export const /* @echo namespace */Dialog = Dialog.compose({
    baseName: "dialog",
    template,
    styles,
});

/**
 * Styles for Dialog
 * @public
 */
export const dialogStyles = styles;

/**
 * Base class for Dialog
 * @public
 */
export { Dialog };
