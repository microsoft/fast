import { html, repeat } from "@microsoft/fast-element";
import { File, fileTemplate as template } from "@microsoft/fast-foundation";
import { FileOptions } from "@microsoft/fast-foundation";
import { fileStyles as styles } from "./file.styles";

/**
 * The default FAST File Template for a file-list
 *  @public
 */
export const defaultFileListTemplate = html<File>`
    <ul>
        ${repeat(
            x => x.fileReferences,
            html<string>`
                <li>${x => x}</li>
            `
        )}
    </ul>
`;

/**
 * The default FAST File Template for a contol-element
 *  @public
 */
export const defaultControlElementTemplate = html<File>`
    <fast-button>Choose a file</fast-button>
`;

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
    fileList: defaultFileListTemplate,
    controlElement: defaultControlElementTemplate,
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
