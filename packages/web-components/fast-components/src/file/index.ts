import {
    FileSelect as File,
    fileTemplate as template,
    defaultFileListTemplate as fileListTemplate,
    defaultControlElementTemplate as controlElementTemplate,
} from "@microsoft/fast-foundation";
import { FileOptions } from "@microsoft/fast-foundation";
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
export const fastFile = File.compose<FileOptions>({
    baseName: "file",
    template,
    styles,
    fileList: fileListTemplate,
    controlElement: controlElementTemplate,
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
