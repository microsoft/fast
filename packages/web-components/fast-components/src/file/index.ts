import { File, fileTemplate as template } from "@microsoft/fast-foundation";
import { fileStyles as styles } from "./file.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#File} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#fileTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-file\>
 */
export const fastFile = File.compose({
    baseName: "file",
    template,
    styles,
});

/**
 * Styles for File
 * @public
 */
export const fileStyles = styles;

/**
 * Base class for File
 * @public
 */
export { File };
