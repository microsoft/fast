import { FileActionObjectUrl } from "./file-action-objecturl";

/**
 * @alpha
 * @remarks
 * FileAction component for transforming files into Object URLs via URL.createObjectURL().
 * HTML Element: \<file-action-objecturl\>
 */
export const fastToolingFileActionObjectUrl = FileActionObjectUrl.compose({
    baseName: "file-action-objecturl",
});
